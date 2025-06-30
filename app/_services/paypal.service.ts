import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import { PinpointSMSVoiceV2Client, SendTextMessageCommand } from '@aws-sdk/client-pinpoint-sms-voice-v2';
import { 
  createSubscriptionRecord,
  updateSubscriptionStatus,
  createPaymentRecord,
  getSubscriptionById,
  activateSubscription,
  updatePackageStatus,
  findPendingPackageByTracking,
  findActivePackageByTracking,
  logNotification,
  Package as DbPackage,
  Subscription,
  findUserByContact,
  getTableName
} from '../lib/db';
import { supabaseAdmin } from '../lib/supabase';
import { createShippoTrackingWebhook, getTrackingStatus } from '../lib/shippoUtils';

interface PayPalOrderData {
  price: string;
  trackingNumber: string; // Used for PayPal reference ID and notifications, not stored in subscriptions table
  planType: 'single' | 'monthly' | 'yearly';
  paypalPlanId: string | null;
  packageLimit: number;
  userId: number;
  pendingPackageId: number;
  cancelPreviousPayPalSubId?: string | null;
  tierName?: string;
  subscriptionType?: string; // Added to support differentiation, e.g., 'packages'
}

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: PayPalLink[];
}

export class PayPalService {
  private pinpointClient: PinpointSMSVoiceV2Client;
  private sesClient: SESClient;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.pinpointClient = new PinpointSMSVoiceV2Client({
      region: process.env.REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
      }
    });
    
    this.sesClient = new SESClient({
      region: process.env.REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ''
      }
    });

    this.baseUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
    console.log('PayPalService initialized with baseUrl:', this.baseUrl);
  }

  public async sendConfirmationNotification(
    userId: number,
    trackingNumber: string,
  ): Promise<{success: boolean, message: string}> {
    let notificationType: 'email' | 'sms' = 'email';
    let contactInfo: string = '';
    let packageId: number | null = null;
    try {
      console.log(`Attempting to send confirmation for tracking #${trackingNumber} to user ${userId}`);
      // Check for test/development environment - similar to shippoUtils
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.log(`[TEST MODE] Would send confirmation notification for tracking ${trackingNumber} to user ${userId}`);
        return { success: true, message: 'Test environment - notification simulated' };
      }
      // Fetch user preferences from the database
      const tableName = getTableName('users');
      const { data: user, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', userId)
        .single();
      if (error || !user) {
        console.error('Error fetching user preferences:', error);
        return { success: false, message: `Failed to fetch user preferences: ${error?.message || 'User not found'}` };
      }
      notificationType = user.notification_preference;
      contactInfo = notificationType === 'email' ? user.email : user.phone;
      if (!contactInfo) {
        console.error(`User ${userId} has no ${notificationType} contact information`);
        return { success: false, message: `User has no ${notificationType} contact information` };
      }
      // Find packageId for logging
      let activePkg = null;
      let pendingPkg = null;
      try {
        activePkg = await findActivePackageByTracking(trackingNumber);
        if (activePkg && activePkg.user_id === userId) {
          packageId = activePkg.id;
        } else {
          pendingPkg = await findPendingPackageByTracking(userId, trackingNumber);
          if (pendingPkg) packageId = pendingPkg.id;
        }
      } catch (pkgErr) {
        console.error('Error finding package for notification logging:', pkgErr);
      }
      // Set carrier for email template
      let carrier = 'usps';
      if (activePkg && activePkg.carrier) carrier = activePkg.carrier;
      else if (pendingPkg && pendingPkg.carrier) carrier = pendingPkg.carrier;
      if (notificationType === 'email') {
        console.log('Sending welcome email with params:', {
          source: process.env.SES_SOURCE_EMAIL || 'notifications@notifytracking.com',
          destination: contactInfo,
          template: 'TrackingWelcome',
          region: process.env.REGION || 'us-east-1'
        });
        await this.sesClient.send(new SendTemplatedEmailCommand({
          Source: process.env.SES_SOURCE_EMAIL || 'notifications@notifytracking.com',
          Destination: {
            ToAddresses: [contactInfo]
          },
          Template: 'TrackingWelcome',
          TemplateData: JSON.stringify({
            tracking_number: trackingNumber,
            notification_type: notificationType,
            contact_info: contactInfo,
            carrier: carrier
          })
        }));
        console.log('Welcome email sent successfully');
        if (packageId) {
          await logNotification({
            packageId,
            userId,
            notificationType,
            contactInfo,
            purpose: 'welcome',
            trackingNumber,
            status: 'SENT'
          });
        }
        return { success: true, message: 'Welcome email sent successfully' };
      } else {
        // Fetch carrier and status for the message
        let currentStatus = 'Status Unavailable';
        try {
          let pkg = null;
          try {
            pkg = await findActivePackageByTracking(trackingNumber);
            if (!pkg || pkg.user_id !== userId) {
              pkg = await findPendingPackageByTracking(userId, trackingNumber);
            }
          } catch {}
          if (pkg && pkg.carrier) {
            carrier = pkg.carrier;
          }
          const trackingStatus = await getTrackingStatus(trackingNumber, carrier);
          if (trackingStatus && trackingStatus.status) {
            currentStatus = trackingStatus.status;
          }
        } catch (err) {
          console.error('Error fetching tracking status for SMS welcome:', err);
        }
        const message = `NotifyTracking: Your package tracking is set up.\nTracking #: ${trackingNumber}\nCurrent status: ${currentStatus}\nWe'll update you on every status change.\n\nTrack at: https://notifytracking.com?tracking=${trackingNumber}&carrier=${carrier}\n\nMessages sent for status changes (max 1 per change). Msg&Data rates may apply. HELP for help, STOP to cancel.`;
        // Ensure phone number is in E.164 format (starts with +)
        let phoneNumber = contactInfo;
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+1${phoneNumber}`;
        }
        try {
          console.log('Sending SMS using Pinpoint with originationIdentity:', process.env.SMS_ORIGINATION_NUMBER || '+16018439964');
          await this.pinpointClient.send(new SendTextMessageCommand({
            DestinationPhoneNumber: phoneNumber,
            MessageBody: message,
            MessageType: 'TRANSACTIONAL',
            OriginationIdentity: process.env.SMS_ORIGINATION_NUMBER || '+16018439964'
          }));
          console.log(`Confirmation SMS sent successfully to ${phoneNumber.substring(0, 5)}***`);
          if (packageId) {
            await logNotification({
              packageId,
              userId,
              notificationType,
              contactInfo,
              purpose: 'welcome',
              trackingNumber,
              status: 'SENT'
            });
          }
          return { success: true, message: 'Welcome SMS sent successfully' };
        } catch (smsError: any) {
          // Log failed notification
          if (packageId) {
            await logNotification({
              packageId,
              userId,
              notificationType,
              contactInfo,
              purpose: 'welcome',
              trackingNumber,
              status: 'FAILED'
            });
          }
          // Check specifically for IAM permissions error
          if (smsError.name === 'AccessDeniedException' || 
              (smsError.$metadata && smsError.$metadata.httpStatusCode === 400 && 
               smsError.__type === 'com.amazon.coral.service#AccessDeniedException')) {
            console.error('IAM permissions error sending SMS. Missing sms-voice:SendTextMessage permission:', {
              errorType: smsError.name,
              errorMessage: smsError.message,
              requestId: smsError.$metadata?.requestId,
              httpStatus: smsError.$metadata?.httpStatusCode
            });
            
            // Fall back to sending welcome information via email if possible
            if (user.email) {
              console.log('Attempting fallback to email notification...');
              try {
                await this.sesClient.send(new SendEmailCommand({
                  Source: process.env.SES_SOURCE_EMAIL || 'notifications@notifytracking.com',
                  Destination: {
                    ToAddresses: [user.email]
                  },
                  Message: {
                    Subject: {
                      Data: `Package Tracking Subscription Confirmed - ${trackingNumber}`
                    },
                    Body: {
                      Text: {
                        Data: `Your package tracking subscription for ${trackingNumber} has been set up. Due to a technical issue, SMS notifications could not be enabled. Please contact support for assistance.`
                      }
                    }
                  }
                }));
                console.log('Fallback email sent successfully');
                return { 
                  success: false, 
                  message: 'SMS notification failed due to permissions. Sent fallback email.' 
                };
              } catch (emailError) {
                console.error('Failed to send fallback email:', emailError);
                return { 
                  success: false, 
                  message: 'Failed to send both SMS and fallback email notification.' 
                };
              }
            }
            return { 
              success: false, 
              message: 'SMS notification failed due to missing IAM permissions (sms-voice:SendTextMessage).' 
            };
          }
          
          // For other errors
          console.error('Error sending SMS notification:', {
            errorType: smsError.name,
            errorMessage: smsError.message,
            requestId: smsError.$metadata?.requestId,
            httpStatus: smsError.$metadata?.httpStatusCode
          });
          return { 
            success: false, 
            message: `SMS notification failed: ${smsError.message || 'Unknown error'}` 
          };
        }
      }
    } catch (error: any) {
      console.error('Error sending confirmation notification:', {
        error,
        userId,
        trackingNumber,
        sesSource: process.env.SES_SOURCE_EMAIL,
        region: process.env.REGION
      });
      return { 
        success: false, 
        message: `Notification failed: ${error.message || 'Unknown error'}` 
      };
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      console.log('Using cached PayPal access token');
      return this.accessToken;
    }

    console.log('Requesting new PayPal access token');
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('PayPal token API error:', error);
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    console.log('New PayPal access token obtained, expires in', data.expires_in, 'seconds');
    return this.accessToken!;
  }

  async createPayPalReference(data: PayPalOrderData): Promise<{ type: 'order' | 'subscription', id: string, dbSubscriptionId: number }> {
    const { 
      price, trackingNumber, planType, paypalPlanId, packageLimit, userId, pendingPackageId, 
      cancelPreviousPayPalSubId, tierName
    } = data;

    console.log('Creating PayPal Reference:', { userId, pendingPackageId, planType, cancelPreviousPayPalSubId });

    try {
      // --- Optional: Cancel Previous Subscription --- 
      if ((planType === 'monthly' || planType === 'yearly') && cancelPreviousPayPalSubId) {
        console.log(`Attempting to cancel previous PayPal subscription: ${cancelPreviousPayPalSubId} before creating new one.`);
        try {
            const cancelled = await this.cancelPayPalSubscription(cancelPreviousPayPalSubId);
            if (cancelled) {
                console.log(`Successfully cancelled previous PayPal subscription: ${cancelPreviousPayPalSubId}`);
            } else {
                 // cancelPayPalSubscription throws on failure, but add a log just in case
                 console.warn(`Cancellation call for ${cancelPreviousPayPalSubId} returned false, but did not throw. Proceeding cautiously.`);
            }
        } catch (cancelError) {
            console.error(`Failed to cancel previous PayPal subscription (${cancelPreviousPayPalSubId}). Proceeding with new subscription creation anyway.`, cancelError);
            // Decide whether to stop or continue. For now, we log and continue.
            // You might want to return an error or flag to the frontend here.
        }
      }
      // --- End Optional Cancellation ---

      // 1. Create the PENDING subscription record in our DB first
      const dbSubscription = await createSubscriptionRecord(
        userId,
        (tierName as 'single' | 'monthly' | 'yearly' | 'Single Package') || (planType === 'single' ? 'Single Package' : planType),
        planType === 'monthly' || planType === 'yearly',
        paypalPlanId,
        packageLimit,
        parseFloat(price)
      );
      console.log('Pending DB subscription created:', { dbSubscriptionId: dbSubscription.id });

      // 2. Get PayPal access token
      const accessToken = await this.getAccessToken();

      // 3. Create PayPal Order (for one-time) or Subscription (for monthly/yearly)
      if (planType === 'monthly' || planType === 'yearly') {
        // --- Create PayPal Subscription --- 
        let planEnvVar = planType === 'yearly' ? process.env.PAYPAL_YEARLY_PLAN_ID : process.env.PAYPAL_MONTHLY_PLAN_ID;
        const planIdToUse = paypalPlanId || planEnvVar;
        if (!planIdToUse) {
          throw new Error('PayPal Plan ID is required for subscriptions.');
        }
        console.log('Creating PayPal Subscription with plan ID:', planIdToUse);
        
        // Log the pendingPackageId if it exists
        if (pendingPackageId) {
          console.log(`Including pendingPackageId ${pendingPackageId} in subscription custom_id`);
        } else {
          console.log('No pendingPackageId to include in subscription custom_id');
        }
        
        const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            plan_id: planIdToUse,
            custom_id: JSON.stringify({
              dbSubId: dbSubscription.id,
              ...(pendingPackageId !== undefined && { pendingPackageId }),
              dbUserId: userId
            }),
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'SUBSCRIBE_NOW',
              return_url: process.env.PAYPAL_RETURN_URL || 'https://example.com/return',
              cancel_url: process.env.PAYPAL_CANCEL_URL || 'https://example.com/cancel'
            }
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('PayPal Subscription API error:', error);
          throw new Error(error.message || 'Failed to create PayPal subscription');
        }
        const subscriptionData = await response.json();
        console.log('PayPal subscription created:', { paypalSubId: subscriptionData.id, status: subscriptionData.status });
        return {
          type: 'subscription',
          id: subscriptionData.id,
          dbSubscriptionId: dbSubscription.id
        };

      } else {
        // --- Create PayPal One-Time Order --- 
        console.log('Creating PayPal One-Time Order');
        const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `order-${dbSubscription.id}-${Date.now()}`
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
              reference_id: trackingNumber,
              description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan - Package Tracking Notification`,
              custom_id: JSON.stringify({ 
                dbSubscriptionId: dbSubscription.id,
                pendingPackageId,
                userId: userId
              }), 
              amount: {
                currency_code: 'USD',
                value: price
              }
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW',
              return_url: process.env.PAYPAL_RETURN_URL || 'https://example.com/return',
              cancel_url: process.env.PAYPAL_CANCEL_URL || 'https://example.com/cancel'
            }
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('PayPal Order API error:', error);
          throw new Error(error.message || 'Failed to create PayPal order');
        }
        const orderData = await response.json();
        console.log('PayPal order created:', { paypalOrderId: orderData.id, status: orderData.status });
        return {
          type: 'order',
          id: orderData.id,
          dbSubscriptionId: dbSubscription.id
        };
      }

    } catch (error) {
      console.error('PayPal reference creation error:', error);
      throw error;
    }
  }

  async capturePayPalOrder(paypalOrderId: string): Promise<any> {
    try {
      console.log('Capturing PayPal order via service:', { paypalOrderId });
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('PayPal capture API error:', { paypalOrderId, error });
        throw new Error(error.message || 'Failed to capture PayPal order');
      }

      const capturedOrderData = await response.json();
      console.log('PayPal capture response received:', { 
        paypalOrderId, 
        status: capturedOrderData.status, 
        captureId: capturedOrderData.purchase_units?.[0]?.payments?.captures?.[0]?.id 
      });

      let customData = null;
      try {
        // Check if custom_id exists and is a string before parsing
        const customIdString = capturedOrderData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
        if (typeof customIdString === 'string') {
            customData = JSON.parse(customIdString);
            console.log('Extracted custom data from capture:', customData);
        } else {
             console.warn('custom_id not found or not a string in captured order data.');
             // Handle cases where maybe it wasn't a subscription with package? 
             // For now, we require dbSubscriptionId later, so this might be okay.
             customData = {}; // Set to empty object
        }
      } catch (parseError) {
        console.error('Failed to parse custom_id from captured order:', parseError);
        throw new Error('Internal processing error: Missing necessary IDs in captured order data.');
      }
      
      // Check for required subscription ID
      const dbSubscriptionId = customData.dbSubscriptionId || customData.dbSubId;
      if (!customData || !dbSubscriptionId) {
        console.error('Missing required subscription ID in custom data:', customData);
        throw new Error('Internal processing error: Missing necessary subscription ID in captured order data.');
      }
      
      // Determine package ID from either field name (support both formats)
      // Check both field names that might have been used in custom_id
      const pendingPackageId = customData.pendingPackageId || customData.dbPkgId;
      console.log('Extracted package ID from capture data:', { pendingPackageId });

      // Extract the tracking number from the order for webhook creation
      // reference_id in the purchase unit holds the tracking number
      const trackingNumber = capturedOrderData.purchase_units?.[0]?.reference_id;
      console.log('Extracted tracking number:', trackingNumber);
      
      // If we have a tracking number and subscription ID, create Shippo webhook
      if (trackingNumber && dbSubscriptionId) {
        try {
          console.log('Creating Shippo tracking webhook');
          await createShippoTrackingWebhook(trackingNumber, dbSubscriptionId);
          console.log('Shippo webhook created successfully');
        } catch (shippoError) {
          console.error('Error creating Shippo webhook:', shippoError);
          // Add warning to returned data instead of failing the whole capture process
          capturedOrderData.warning = (capturedOrderData.warning || '') + ' Failed to set up tracking updates.';
        }
      } else {
        console.warn('Missing tracking number or subscription ID for Shippo webhook creation:',
          { trackingNumber, dbSubscriptionId });
      }

      return { 
        ...capturedOrderData, 
        dbSubscriptionId: dbSubscriptionId,
        pendingPackageId: pendingPackageId,
        trackingNumber: trackingNumber, // Add tracking number to return object explicitly
        userId: customData.userId || customData.dbUserId // Support both field names
      };

    } catch (error) {
      console.error('PayPal capture order service error:', error);
      throw error;
    }
  }

  // Add method to cancel PayPal subscription
  async cancelPayPalSubscription(paypalSubscriptionId: string): Promise<boolean> {
    if (!paypalSubscriptionId) {
      console.warn('Attempted to cancel PayPal subscription with no ID.');
      return true; // Treat as success if there's nothing to cancel
    }

    console.log(`Attempting to cancel PayPal subscription: ${paypalSubscriptionId}`);
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${paypalSubscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Subscription cancelled by user request via application.' })
      });

      // PayPal returns 204 No Content on successful cancellation
      if (response.status === 204) {
        console.log(`PayPal subscription ${paypalSubscriptionId} cancelled successfully (Status 204).`);
        return true;
      } else {
        // Attempt to parse error details if not successful
        let errorDetails = {};
        try {
           errorDetails = await response.json();
        } catch (e) { 
           // Ignore if response body is not JSON
           errorDetails = { statusText: response.statusText };
        } 
        console.error(`PayPal subscription cancellation failed for ${paypalSubscriptionId}. Status: ${response.status}`, errorDetails);
        throw new Error(`PayPal API Error: ${response.status} - ${JSON.stringify(errorDetails)}`);
      }
    } catch (error) {
      console.error(`Error cancelling PayPal subscription ${paypalSubscriptionId}:`, error);
      throw error; // Re-throw the error to be caught by the API route
    }
  }

  // Comprehensive method to handle entire one-time payment flow
  async processOneTimePayment(orderId: string): Promise<any> {
    try {
      console.log('Processing one-time payment:', { orderId });
      
      // 1. Capture the PayPal order
      const capturedData = await this.capturePayPalOrder(orderId);
      console.log('PayPal capture successful:', capturedData);

      // 2. Verify capture was successful
      if (capturedData.status !== 'COMPLETED') {
        console.warn(`PayPal order ${orderId} captured but status is ${capturedData.status}`);
        throw new Error(`Payment capture failed or is pending. Status: ${capturedData.status}`);
      }

      // 3. Extract necessary data
      const captureDetails = capturedData.purchase_units?.[0]?.payments?.captures?.[0];
      const paymentAmount = parseFloat(captureDetails?.amount?.value || '0');
      const paymentCurrency = captureDetails?.amount?.currency_code || 'USD';
      const paypalCaptureId = captureDetails?.id;
      const { dbSubscriptionId, pendingPackageId, userId } = capturedData;
      
      if (dbSubscriptionId === undefined || pendingPackageId === undefined) {
        throw new Error('Internal processing error: Missing necessary IDs for subscription or package.');
      }
      
      // 4. Create payment record
      try {
        await createPaymentRecord({
          subscriptionId: dbSubscriptionId,
          packageId: pendingPackageId,
          paypalOrderId: orderId,
          paypalCaptureId: paypalCaptureId,
          paypalSubscriptionId: null, // One-time payment, no subscription ID
          amount: paymentAmount,
          currency: paymentCurrency,
          status: capturedData.status,
          userId: userId
        });
        console.log('Payment record created successfully');
      } catch (paymentError) {
        console.error('Failed to create payment record:', paymentError);
        // Continue despite error
      }

      // 5. Fetch the pending subscription record
      const dbSubscription = await getSubscriptionById(dbSubscriptionId);
      if (!dbSubscription || dbSubscription.status !== 'PENDING') {
        throw new Error('Subscription record not found or already processed.');
      }

      // 6. Activate subscription and package
      let activatedSub = null;
      let activatedPkg = null;
      let activationError = null;
      
      try {
        // Activate subscription
        activatedSub = await activateSubscription(
          dbSubscriptionId,
          null, // No PayPal subscription ID for one-time payments
          dbSubscription.package_limit,
          userId
        );
        console.log(`Subscription ${dbSubscriptionId} activated`);
        
        // Activate and link package
        activatedPkg = await updatePackageStatus(
          pendingPackageId,
          'ACTIVE',
          dbSubscriptionId
        );
        console.log(`Package ${pendingPackageId} activated and linked to subscription ${dbSubscriptionId}`);
        
        // If subscription_id is not set on the package, try direct update
        if (!activatedPkg.subscription_id) {
          console.warn(`Package subscription_id not set after updatePackageStatus. Attempting direct update.`);
          const packagesTable = getTableName('packages');
          const { data: updatedPkg, error: updateError } = await supabaseAdmin
            .from(packagesTable)
            .update({ 
              subscription_id: dbSubscriptionId,
              status: 'ACTIVE'
            })
            .eq('id', pendingPackageId)
            .select()
            .single();
            
          if (updateError) {
            throw new Error(`Failed to link package to subscription: ${updateError.message}`);
          }
          
          if (updatedPkg) {
            activatedPkg = updatedPkg;
            console.log(`Package updated directly with subscription ID ${dbSubscriptionId}`);
          }
        }
      } catch (error) {
        console.error('Error during activation:', error);
        activationError = error;
      }

      // 7. Send welcome notification
      let notificationWarning = null;
      if (activatedPkg && userId) {
        const trackingNumber = activatedPkg.tracking_number;
        try {
          console.log(`Sending confirmation notification for tracking #${trackingNumber} to user ${userId}`);
          const notifyResult = await this.sendConfirmationNotification(userId, trackingNumber);
          
          if (!notifyResult.success) {
            // Handle specific error cases
            const isTokenError = notifyResult.message?.includes('The security token included in the request is invalid');
            const isSmsErrorForEmailUser = notifyResult.message?.includes('has no sms contact information');
            
            if (isTokenError) {
              console.warn('Suppressed security token error for notification.');
            } else if (isSmsErrorForEmailUser) {
              // Check if user prefers email
              const usersTable = getTableName('users');
              const { data: user } = await supabaseAdmin
                .from(usersTable)
                .select('notification_preference, email')
                .eq('id', userId)
                .single();
                  
              if (user?.notification_preference === 'email' && user?.email) {
                console.log('User prefers email notifications. Suppressing SMS error.');
              } else {
                notificationWarning = notifyResult.message || 'Failed to send confirmation notification.';
              }
            } else {
              notificationWarning = notifyResult.message || 'Failed to send confirmation notification.';
            }
          }
        } catch (notifyError: any) {
          console.error('Error sending confirmation notification:', notifyError);
          const isTokenError = notifyError.message?.includes('The security token included in the request is invalid');
          if (!isTokenError) {
            notificationWarning = 'Failed to send confirmation notification.';
          }
        }
      }

      // 8. Create Shippo webhook for tracking updates
      const trackingNumber = activatedPkg?.tracking_number;
      if (trackingNumber && dbSubscriptionId) {
        try {
          console.log(`Creating Shippo webhook for tracking ${trackingNumber}`);
          await createShippoTrackingWebhook(trackingNumber, dbSubscriptionId);
          console.log('Shippo webhook created successfully');
        } catch (shippoError) {
          console.error('Error creating Shippo webhook:', shippoError);
          notificationWarning = (notificationWarning || '') + ' Failed to set up tracking updates.';
        }
      }

      // 9. Prepare response
      const responsePayload = {
        success: !activationError,
        message: activationError 
          ? 'Payment successful, but error activating service. Contact support.'
          : 'Payment successful and subscription activated.',
        paypalOrderId: orderId,
        captureId: paypalCaptureId,
        dbSubscriptionId: dbSubscriptionId,
        activatedPackageId: activatedPkg?.id,
        warning: notificationWarning
      };
      
      return responsePayload;
    } catch (error) {
      console.error('Error processing one-time payment:', error);
      throw error;
    }
  }

  // Comprehensive method to handle entire subscription payment flow
  async processSubscriptionActivation(
    subscriptionId: number,
    paypalSubscriptionId: string,
    pendingPackageId?: number,
    trackingNumber?: string,
    userId?: number
  ): Promise<any> {
    try {
      console.log('Processing subscription activation:', {
        subscriptionId,
        paypalSubscriptionId,
        pendingPackageId,
        trackingNumber,
        userId
      });
      
      if (!subscriptionId || !paypalSubscriptionId || userId === undefined || userId === null) {
        throw new Error('Missing required fields: subscriptionId, paypalSubscriptionId, and userId');
      }

      // 1. Fetch the pending subscription record
      const dbSubscription = await getSubscriptionById(subscriptionId);
      if (!dbSubscription) {
        throw new Error('Subscription not found');
      }
      
      if (dbSubscription.status !== 'PENDING') {
        return {
          success: true,
          message: `Subscription already in ${dbSubscription.status} state.`,
          dbSubscriptionId: subscriptionId
        };
      }

      // 1.5 Create payment record for subscription
      try {
        // Get subscription price from subscription record
        const paymentAmount = dbSubscription.amount || 0;
        
        await createPaymentRecord({
          subscriptionId: subscriptionId,
          packageId: pendingPackageId || null,
          paypalOrderId: null, // No order ID for subscriptions
          paypalCaptureId: null, // No capture ID for subscriptions
          paypalSubscriptionId: paypalSubscriptionId,
          amount: paymentAmount,
          currency: 'USD', // Default currency
          status: 'COMPLETED', // Assume completed if we're activating
          userId: userId
        });
        console.log('Payment record created successfully for subscription');
      } catch (paymentError) {
        console.error('Failed to create payment record for subscription:', paymentError);
        // Continue despite error
      }

      // 2. Activate the subscription
      let activatedSub = null;
      let activatedPkg = null;
      let packageError = null;
      
      activatedSub = await activateSubscription(
        subscriptionId,
        paypalSubscriptionId,
        dbSubscription.package_limit,
        userId
      );
      console.log(`Subscription ${subscriptionId} activated successfully`);

      // 3. Process package link
      let packageIdToActivate = pendingPackageId;

      if (!packageIdToActivate && trackingNumber) {
        console.log(`No pendingPackageId provided but have trackingNumber ${trackingNumber}. Looking for existing package.`);
        const existingPkg = await findPendingPackageByTracking(userId, trackingNumber);
        if (existingPkg) {
          console.log(`Found existing pending package ID ${existingPkg.id} for tracking ${trackingNumber}`);
          packageIdToActivate = existingPkg.id;
        }
      }

      // 4. If we have a package, activate and link it
      if (packageIdToActivate) {
        try {
          console.log(`Activating package ID ${packageIdToActivate} and linking to subscription ${subscriptionId}`);
          activatedPkg = await updatePackageStatus(
            packageIdToActivate,
            'ACTIVE',
            subscriptionId
          );
          console.log(`Package ${packageIdToActivate} activated successfully`);
        } catch (pkgError: any) {
          console.error(`Error activating package ${packageIdToActivate}:`, pkgError);
          packageError = pkgError.message || 'Failed to activate package';
        }
      }

      // 5. Send confirmation notification and create webhook
      let notificationWarning = null;
      if (activatedPkg && trackingNumber) {
        // Send welcome notification
        try {
          console.log('Sending confirmation notification...');
          const notifyResult = await this.sendConfirmationNotification(
            userId,
            activatedPkg.tracking_number || trackingNumber
          );
          
          // Create Shippo webhook for tracking updates
          try {
            console.log('Creating Shippo tracking webhook');
            await createShippoTrackingWebhook(activatedPkg.tracking_number || trackingNumber, subscriptionId);
            console.log('Shippo webhook created successfully');
          } catch (shippoError) {
            console.error('Error creating Shippo webhook:', shippoError);
            notificationWarning = (notificationWarning || '') + ' Failed to set up tracking updates.';
          }
          
          if (!notifyResult.success) {
            // Handle specific error cases
            const isTokenError = notifyResult.message?.includes('The security token included in the request is invalid');
            const isSmsErrorForEmailUser = notifyResult.message?.includes('has no sms contact information');
            
            if (isTokenError) {
              console.warn('Suppressed security token error for notification.');
              notificationWarning = notificationWarning || null;
            } else if (isSmsErrorForEmailUser) {
              // Check if user prefers email
              const usersTable = getTableName('users');
              const { data: user } = await supabaseAdmin
                .from(usersTable)
                .select('notification_preference, email')
                .eq('id', userId)
                .single();
                  
              if (user?.notification_preference === 'email' && user?.email) {
                console.log('User prefers email notifications. Suppressing SMS error.');
                notificationWarning = notificationWarning || null;
              } else {
                notificationWarning = notificationWarning || notifyResult.message || 'Failed to send confirmation notification.';
              }
            } else {
              notificationWarning = notificationWarning || notifyResult.message || 'Failed to send confirmation notification.';
            }
          }
        } catch (notifyError: any) {
          console.error('Error in notification process:', notifyError);
          const isTokenError = notifyError.message?.includes('The security token included in the request is invalid');
          if (isTokenError) {
            console.warn('Suppressed security token error for notification (caught exception).');
            notificationWarning = null;
          } else {
            notificationWarning = 'Failed to send confirmation notification.';
          }
        }
      }

      // 6. Prepare response
      const response = {
        success: true,
        message: packageError 
          ? `Subscription activated but package activation failed: ${packageError}`
          : activatedPkg 
            ? 'Subscription and package activated successfully' 
            : 'Subscription activated successfully (no package linked)',
        dbSubscriptionId: subscriptionId,
        activatedPackageId: activatedPkg?.id,
        subscription: {
          id: activatedSub.id,
          status: activatedSub.status,
          tier_name: activatedSub.tier_name,
          is_monthly: activatedSub.is_monthly,
          paypal_subscription_id: activatedSub.paypal_subscription_id
        },
        warning: notificationWarning
      };
      
      console.log('Subscription activation complete:', response);
      return response;
    } catch (error) {
      console.error('Error processing subscription activation:', error);
      throw error;
    }
  }
}

export const paypalService = new PayPalService(); 