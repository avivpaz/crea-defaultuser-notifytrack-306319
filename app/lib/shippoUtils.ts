// app/lib/shippoUtils.ts

// Types
export interface ShippoLocation {
  city: string;
  state: string;
  zip: string;
}

export interface ShippoTrackingEvent {
  status: string;
  status_description?: string;
  status_date: string;
  location?: ShippoLocation;
}

export interface ShippoTrackingStatus {
  status: string;
  status_details?: string;
  status_description?: string;
  status_date: string;
  location?: ShippoLocation;
}

export interface ShippoResponse {
  tracking_number: string;
  tracking_status: ShippoTrackingStatus;
  tracking_history: ShippoTrackingEvent[];
  eta?: string;
}

export interface ShippoErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
}

export interface TrackingEvent {
  status: string;
  location: string | null;
  timestamp: string;
}

export interface TrackingStatus {
  status: string;
  summary: string;
  details: string;
  lastUpdate: string;
  deliveryDate: string | null;
  location: string | null;
  events?: TrackingEvent[];
}

// Constants
const SHIPPO_API_URL = 'https://api.goshippo.com';

// Test environment constants
const TEST_TRACKING_NUMBERS = {
  DELIVERED: 'SHIPPO_DELIVERED',
  TRANSIT: 'SHIPPO_TRANSIT',
  FAILURE: 'SHIPPO_FAILURE',
  RETURNED: 'SHIPPO_RETURNED',
  UNKNOWN: 'SHIPPO_UNKNOWN',
  INVALID: 'INVALID_TRACKING_NUMBER',
  PRE_TRANSIT: 'SHIPPO_PRE_TRANSIT'
};

// Utility functions
// Move API key validation to runtime only
export function getShippoConfig() {
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) {
    throw new Error('Shippo API key is not configured');
  }
  
  return {
    apiKey,
    isTestEnv: apiKey.startsWith('shippo_test')
  };
}

export const formatLocation = (location?: ShippoLocation): string | null => {
  if (!location) return null;
  const { city, state, zip } = location;
  return `${city}, ${state} ${zip}`;
};

export const mapTrackingEvent = (event: ShippoTrackingEvent): TrackingEvent => ({
  status: event.status_description || event.status,
  location: formatLocation(event.location),
  timestamp: event.status_date
});

export const mapTrackingStatus = (data: ShippoResponse): TrackingStatus | null => {
  // If there's no tracking status and empty tracking history, return null
  if (!data.tracking_status && (!data.tracking_history || data.tracking_history.length === 0)) {
    return null;
  }

  return {
    status: data.tracking_status?.status || 'UNKNOWN',
    summary: data.tracking_status?.status_details || '',
    details: data.tracking_status?.status_description || '',
    lastUpdate: data.tracking_status?.status_date || '',
    deliveryDate: data.eta || null,
    location: formatLocation(data.tracking_status?.location),
    events: data.tracking_history?.map(mapTrackingEvent)
  };
};

export const isValidTestTrackingNumber = (trackingNumber: string): boolean => {
  const { isTestEnv } = getShippoConfig();
  if (!isTestEnv) return true; // In non-test env, all are considered valid *for this check*
  return Object.values(TEST_TRACKING_NUMBERS).includes(trackingNumber);
};

// API Functions
export async function getTrackingStatus(trackingNumber: string, carrier: string = 'usps'): Promise<TrackingStatus | null> {
  const { apiKey, isTestEnv } = getShippoConfig();
  // Use provided carrier parameter instead of environment variable
  const carrierCode = carrier.toLowerCase();

  // For development/testing: bypass validation and return mock data
  // This allows any tracking number format to work during testing
  if (process.env.NODE_ENV === 'development' || isTestEnv) {
    console.log(`Development mode: Bypassing Shippo validation for tracking number: ${trackingNumber} (carrier: ${carrierCode})`);
    
    // Return mock tracking data
    return {
      status: 'TRANSIT',
      summary: 'Package in transit for testing',
      details: 'This is mock data for development/testing',
      lastUpdate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      location: 'Test Location, CA',
      events: [
        {
          status: 'TRANSIT',
          location: 'Test Location, CA',
          timestamp: new Date().toISOString(),
        },
        {
          status: 'LABEL_CREATED',
          location: 'Origin Facility, CA',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        }
      ]
    };
  }

  // The original implementation continues below for production
  try {
    const response = await fetch(`${SHIPPO_API_URL}/tracks/${carrierCode}/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorData = data as ShippoErrorResponse;
      if (response.status === 404 || errorData?.detail?.includes('not found')) {
        console.log(`Tracking number ${trackingNumber} not found via Shippo.`);
        return null; // Treat "not found" as null status, not an error
      }
      
      // Log specific error details if available
      console.error(`Shippo API Error (${response.status}):`, errorData);
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `Failed to get tracking status (${response.status})`
      );
    }

    // Check if we have any meaningful tracking data
    if (!data.tracking_status && (!data.tracking_history || data.tracking_history.length === 0)) {
      console.log(`No tracking status or history found for ${trackingNumber}.`);
      return null; // Return null if no meaningful data
    }

    return mapTrackingStatus(data as ShippoResponse);
  } catch (error) {
    // Log the caught error before re-throwing or handling
    console.error(`Error in getTrackingStatus for ${trackingNumber}:`, error);
    // Re-throw the error to be handled by the calling API route
    throw error; 
  }
}

// Create Shippo webhook for tracking number
export async function createShippoTrackingWebhook(
  trackingNumber: string,
  subscriptionId: number
): Promise<boolean> {
  const { apiKey, isTestEnv } = getShippoConfig();
  const carrier = process.env.CARRIER || 'usps';
  
  // Clean tracking number by removing any spaces
  const cleanedTrackingNumber = trackingNumber.replace(/\s+/g, '');

  // In test environment, just log and return success
  if (process.env.NODE_ENV === 'development' || isTestEnv) {
    console.log(`[TEST MODE] Would register webhook for tracking ${cleanedTrackingNumber} (carrier: ${carrier}) with subscription ${subscriptionId}`);
    return true;
  }

  try {
    console.log('Creating Shippo tracking webhook:', { 
      carrier, 
      trackingNumber: cleanedTrackingNumber, 
      subscriptionId 
    });
    
    // Call Shippo API to register webhook
    const response = await fetch(`${SHIPPO_API_URL}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        carrier,
        tracking_number: cleanedTrackingNumber,
        metadata: `Subscription ${subscriptionId}`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Shippo webhook registration error:', errorData);
      throw new Error(
        errorData.detail || 
        errorData.message || 
        'Failed to create Shippo webhook'
      );
    }

    const data = await response.json();
    // Log the full response for debugging
    console.log('Full Shippo webhook response:', data);
    // Check for a unique identifier
    const webhookId = data.id || data.object_id;
    if (!webhookId) {
      console.error('Shippo webhook creation succeeded (HTTP 2xx) but no ID returned:', data);
      throw new Error('Shippo webhook creation did not return a webhook ID');
    }
    console.log('Shippo webhook created successfully:', {
      trackingId: webhookId,
      trackingStatus: data.tracking_status || data.status || 'unknown',
      subscriptionId
    });
    return true;
  } catch (error) {
    console.error(`Error creating Shippo webhook for ${cleanedTrackingNumber}:`, error);
    throw error;
  }
} 