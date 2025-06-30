import { supabaseAdmin } from './supabase';

// --- Helper Function for Dynamic Table Names ---
export const getTableName = (baseName: string): string => {
  const suffix = process.env.NODE_ENV === 'development' ? '_dev' : '';
  return `${baseName}${suffix}`;
};

// --- New Interfaces based on Schema ---
export interface User {
  id: number;
  email?: string | null;
  phone?: string | null;
  notification_preference: 'email' | 'sms';
  created_at: Date;
  updated_at: Date;
}
  
export interface Subscription {
  id: number;
  user_id: number;
  paypal_plan_id?: string | null;
  paypal_subscription_id?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  tier_name: 'single' | 'monthly' | 'yearly' | 'Single Package';
  is_monthly: boolean;
  package_limit: number;
  amount: number;
  current_period_end?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Package {
  id: number;
  user_id: number;
  subscription_id?: number | null;
  tracking_number: string;
  carrier: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
}

// --- Existing Interface (Modified) ---
export interface TrackingUpdate {
  id: number;
  tracking_number: string;
  status: string;
  status_details: string;
  status_date: Date;
  carrier: string;
  location?: any;
  created_at: Date;
}

// --- Tracking Updates (Unchanged, except maybe table name if required, but seems unlikely) ---
export async function createTrackingUpdate(data: {
  tracking_number: string;
  status: string;
  status_details: string;
  status_date: Date;
  carrier: string;
}) {
  const tableName = 'tracking_updates'; // Assuming this table name doesn't change with env
  // First check if this tracking number + status combination already exists
  const { data: existing } = await supabaseAdmin
    .from(tableName)
    .select('id') // Select only id for check
    .eq('tracking_number', data.tracking_number)
    .eq('status', data.status)
    .maybeSingle();

  // If it exists, return the existing record (or just indicate success)
  if (existing) {
    // console.log('Tracking update already exists:', data.tracking_number, data.status);
    return { id: existing.id, ...data }; // Return simulated full record or just existing ID
  }

  // If it doesn't exist, create a new record
  const { data: result, error } = await supabaseAdmin
    .from(tableName)
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating tracking update:', error);
    throw error;
  }

  return result;
}

export async function getTrackingUpdates(tracking_number: string) {
  const tableName = 'tracking_updates'; // Assuming this table name doesn't change
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('tracking_number', tracking_number)
    .order('status_date', { ascending: false });

  if (error) throw error;
  return data;
}

// --- User Functions ---

export async function findUserByContact(
  contactInfo: string,
  type: 'email' | 'sms'
): Promise<User | null> {
  const tableName = getTableName('users');
  const column = type === 'email' ? 'email' : 'phone';

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq(column, contactInfo)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    console.error(`Error finding user by ${type}:`, error);
    throw error;
  }
  return data;
}

export async function findUserById(
  userId: number
): Promise<User | null> {
  const tableName = getTableName('users');

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('id', userId)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    console.error(`Error finding user by ID ${userId}:`, error);
    throw error;
  }
  return data;
}

export async function createUser(
  contactInfo: string,
  type: 'email' | 'sms'
): Promise<User> {
  const tableName = getTableName('users');
  const userData = {
    [type === 'email' ? 'email' : 'phone']: contactInfo,
    notification_preference: type,
  };

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  if (!data) {
     throw new Error('Failed to create user: No data returned');
  }
  return data;
}

export async function findOrCreateUser(
  contactInfo: string,
  type: 'email' | 'sms'
): Promise<User> {
  const existingUser = await findUserByContact(contactInfo, type);
  if (existingUser) {
    return existingUser;
  }
  return createUser(contactInfo, type);
}

// --- Package Functions ---

export async function findActivePackageByTracking(
  trackingNumber: string
): Promise<Package | null> {
  const tableName = getTableName('packages');
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('tracking_number', trackingNumber)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false }) // Get the latest active one if multiple somehow exist
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error finding active package:', error);
    throw error;
  }
  return data;
}

export async function findPendingPackageByTracking(
  userId: number,
  trackingNumber: string
): Promise<Package | null> {
    const tableName = getTableName('packages');
    // Don't filter by carrier, just find any pending package with this tracking number for this user
    const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_number', trackingNumber)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('Error finding pending package by tracking:', error);
        throw error;
    }
    return data;
}

export async function findPendingPackage(
  userId: number,
  trackingNumber: string,
  carrier: string
): Promise<Package | null> {
    const tableName = getTableName('packages');
    const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_number', trackingNumber)
        .eq('carrier', carrier)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('Error finding pending package:', error);
        throw error;
    }
    return data;
}

export async function createPendingPackage(
  userId: number,
  trackingNumber: string,
  carrier: string
): Promise<Package> {
  const tableName = getTableName('packages');
  const packageData = {
    user_id: userId,
    tracking_number: trackingNumber,
    carrier: carrier,
    status: 'PENDING',
    subscription_id: null // Explicitly null initially
  };

  console.log(`Creating pending package with carrier: ${carrier} for tracking: ${trackingNumber}`);

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .insert(packageData)
    .select()
    .single();

  if (error) {
    console.error('Error creating pending package:', error);
    throw error;
  }
   if (!data) {
     throw new Error('Failed to create pending package: No data returned');
   }
  return data;
}

// Finds or creates a pending package record
export async function findOrCreatePendingPackage(
  userId: number,
  trackingNumber: string,
  carrier: string
): Promise<Package> {
    // First check if ANY package exists with this tracking number
    const existingAnyPackage = await findAnyPackageByTracking(trackingNumber);
    if (existingAnyPackage) {
        // If package exists but belongs to a different user, throw an error
        if (existingAnyPackage.user_id !== userId) {
            throw new Error('This tracking number is already being tracked by another user');
        }
        
        // If package exists for this user but is INACTIVE, update it to PENDING
        if (existingAnyPackage.status === 'INACTIVE') {
            const tableName = getTableName('packages');
            const { data, error } = await supabaseAdmin
                .from(tableName)
                .update({ status: 'PENDING', carrier })
                .eq('id', existingAnyPackage.id)
                .select()
                .single();
                
            if (error) {
                console.error('Error reactivating package:', error);
                throw error;
            }
            return data;
        }
        
        // If package exists and is either PENDING or ACTIVE, just return it
        return existingAnyPackage;
    }
    
    // If no package exists with this tracking number, create a new one
    return createPendingPackage(userId, trackingNumber, carrier);
}

export async function updatePackageStatus(
    packageId: number,
    status: 'ACTIVE' | 'INACTIVE',
    subscriptionId?: number | null // Optional: link to subscription when activating
): Promise<Package> {
    const tableName = getTableName('packages');
    const updateData: Partial<Package> = { status };
    
    // Always set subscription_id when provided, regardless of status
    if (subscriptionId !== undefined) {
        console.log(`Setting subscription_id=${subscriptionId} for package ${packageId}`);
        updateData.subscription_id = subscriptionId;
    }

    console.log(`Updating package ${packageId} with data:`, updateData);

    const { data, error } = await supabaseAdmin
        .from(tableName)
        .update(updateData)
        .eq('id', packageId)
        .select()
        .single();

    if (error) {
        console.error('Error updating package status:', error);
        throw error;
    }
    if (!data) {
        throw new Error('Failed to update package status: No data returned');
    }
    
    console.log(`Package ${packageId} updated successfully:`, {
        id: data.id,
        status: data.status,
        subscription_id: data.subscription_id
    });
    
    return data;
}

// --- Subscription Functions ---

export async function getUserActiveMonthlySubscription(
  userId: number
): Promise<Subscription | null> {
  const tableName = getTableName('subscriptions');
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .eq('is_monthly', true)
    .order('created_at', { ascending: false }) // Get the most recent active one
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching active monthly subscription:', error);
    throw error;
  }
  return data;
}

export async function createSubscriptionRecord(
  userId: number,
  tierName: 'single' | 'monthly' | 'yearly' | 'Single Package',
  isMonthly: boolean,
  paypalPlanId: string | null,
  packageLimit: number,
  amount: number
): Promise<Subscription> {
  const tableName = getTableName('subscriptions');
  const subscriptionData: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'status' | 'paypal_subscription_id' | 'current_period_end'> = {
    user_id: userId,
    tier_name: tierName,
    is_monthly: isMonthly,
    paypal_plan_id: paypalPlanId,
    package_limit: packageLimit,
    amount,
  };

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .insert({
        ...subscriptionData,
        status: 'PENDING', // Start as PENDING
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription record:', error);
    throw error;
  }
  if (!data) {
    throw new Error('Failed to create subscription record: No data returned');
  }
  return data;
}

export async function activateSubscription(
  subscriptionId: number,
  paypalSubscriptionId: string | null, // Only for monthly
  packageLimit: number, // Needed to set initial remaining packages
  userId: number // Add userId to find other subscriptions
): Promise<Subscription> {
    const tableName = getTableName('subscriptions');
    const subscriptionsTable = tableName; // Alias for clarity

    // --- Step 1: Deactivate other ACTIVE subscriptions for this user ---
    console.log(`Deactivating other ACTIVE subscriptions for user ${userId} before activating ${subscriptionId}...`);
    const { error: deactivateError } = await supabaseAdmin
        .from(subscriptionsTable)
        .update({ 
            status: 'INACTIVE', 
            updated_at: new Date().toISOString() 
         })
        .eq('user_id', userId)
        .eq('status', 'ACTIVE')
        .neq('id', subscriptionId); // Don't deactivate the one we are about to activate

    if (deactivateError) {
        console.error(`Error deactivating other subscriptions for user ${userId}:`, deactivateError);
        // Decide if this is critical. For now, log and continue, but activation might lead to duplicates again.
        // throw new Error('Failed to deactivate existing subscriptions before activation.');
    }

    // --- Step 2: Activate the target subscription --- 
    console.log(`Activating subscription ${subscriptionId} for user ${userId}`);
    const updateData: Partial<Subscription> & { status: 'ACTIVE' } = {
        status: 'ACTIVE',
        paypal_subscription_id: paypalSubscriptionId, 
        updated_at: new Date() // Ensure updated_at is set (Fixed type mismatch)
    };

    // Set initial current_period_end ONLY for monthly subscriptions upon activation
    // Fetch the subscription details first to check is_monthly
    const { data: subDetails, error: fetchSubError } = await supabaseAdmin
        .from(subscriptionsTable)
        .select('is_monthly')
        .eq('id', subscriptionId)
        .single();

    if (fetchSubError || !subDetails) {
        console.error(`Error fetching subscription details for ${subscriptionId} before activation:`, fetchSubError);
        throw new Error('Failed to fetch subscription details for activation.');
    }

    if (subDetails.is_monthly) {
        const activationDate = new Date();
        const periodEndDate = new Date(activationDate);
        periodEndDate.setMonth(activationDate.getMonth() + 1);
        updateData.current_period_end = periodEndDate;
        console.log(`Setting initial current_period_end for monthly subscription ${subscriptionId} to: ${periodEndDate.toISOString()}`);
    }

    const { data, error: activateError } = await supabaseAdmin
        .from(subscriptionsTable)
        .update(updateData)
        .eq('id', subscriptionId)
        .eq('status', 'PENDING') // Only activate PENDING subs
        .select()
        .single();

     if (activateError) {
        console.error(`Error activating subscription ${subscriptionId}:`, activateError);
        throw activateError; // Activation failure is critical
    }
    if (!data) {
        // This could happen if the subscription was already active or didn't exist
        console.error(`Failed to activate subscription ${subscriptionId}: Record not found or not in PENDING state.`);
        // Attempt to fetch the subscription anyway to see its current state
        const { data: currentSub, error: fetchErr } = await supabaseAdmin
            .from(subscriptionsTable)
            .select('*')
            .eq('id', subscriptionId)
            .single();
        if (currentSub) {
             console.error('Current state of subscription:', currentSub);
             throw new Error(`Failed to activate subscription ${subscriptionId}. Current status: ${currentSub.status}. Expected PENDING.`);
        } else {
            console.error('Fetch error after activation failure:', fetchErr);
             throw new Error(`Failed to activate subscription ${subscriptionId}: Record not found.`);
        }
    }
    console.log(`Subscription ${subscriptionId} activated successfully.`);
    return data;
}

export async function updateSubscriptionStatus(
  subscriptionId: number,
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED',
  paypalSubscriptionId?: string // Optionally update PayPal ID if status changes relate to it
): Promise<Subscription> {
  const tableName = getTableName('subscriptions');
  const updateData: Partial<Subscription> = { status };
  if (paypalSubscriptionId !== undefined) {
      updateData.paypal_subscription_id = paypalSubscriptionId;
  }

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .update(updateData)
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) {
      console.error(`Error updating subscription ${subscriptionId} status to ${status}:`, error);
      throw error;
  }
  if (!data) {
      throw new Error(`Failed to update subscription ${subscriptionId} status: No data returned.`);
  }
  return data;
}

// Function to fetch a subscription by its primary key ID
export async function getSubscriptionById(id: number): Promise<Subscription | null> {
  console.log(`Fetching subscription by ID: ${id}`);
  const tableName = getTableName('subscriptions');
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('id', id)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    console.error(`Error finding subscription by ID ${id}:`, error);
    throw error;
  }
  if (!data) {
      console.log(`Subscription with ID ${id} not found.`);
  }
  return data;
}

// --- DEPRECATED / TO BE REMOVED (Old Subscription Functions) ---

// --- Payment Functions (Placeholder) ---

// Function to record a payment transaction
export async function createPaymentRecord(details: {
  subscriptionId: number | null; // Link to subscription if applicable
  packageId?: number | null; // Link to package if applicable
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  paypalSubscriptionId?: string | null;
  amount: number; // Should be retrieved from capture details
  currency: string; // Should be retrieved from capture details
  status: string; // e.g., COMPLETED, FAILED
  userId?: number | null;
}): Promise<any> { // Return type depends on your schema/needs
  console.log('Recording payment transaction:', details);
  const tableName = getTableName('payments'); // Assuming a 'payments' table

  // TODO: Refine the data structure based on actual DB schema
  const paymentData = {
      user_id: details.userId,
      subscription_id: details.subscriptionId,
      package_id: details.packageId,
      paypal_order_id: details.paypalOrderId,
      paypal_capture_id: details.paypalCaptureId,
      paypal_subscription_id: details.paypalSubscriptionId,
      amount: details.amount,
      currency: details.currency,
      status: details.status,
      // Add other relevant fields like created_at (handled by DB?), payment_method
  };

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .insert([paymentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating payment record:', error);
    throw error;
  }
  console.log('Payment record created successfully:', data.id);
  return data;
}

// --- New Function to Count Active Packages ---
export async function countActivePackagesForSubscription(subscription: Subscription): Promise<number> {
  const tableName = getTableName('packages');

  // --- Calculate start date of the current billing cycle ---
  let cycleStartDate: Date;
  if (subscription.current_period_end) {
    // Calculate start date based on the end date
    cycleStartDate = new Date(subscription.current_period_end);
    cycleStartDate.setMonth(cycleStartDate.getMonth() - 1);
    // Note: This is an approximation. For exactness, consider storing the anchor date.
  } else {
    // Fallback: Use the date the subscription was last updated (likely activation/renewal)
    cycleStartDate = new Date(subscription.updated_at);
  }
  console.log(`Counting packages for subscription ${subscription.id} active since ${cycleStartDate.toISOString()}`);
  // --- End Calculation ---

  const { count, error } = await supabaseAdmin
    .from(tableName)
    .select('*', { count: 'exact', head: true }) // Use head:true for performance
    .eq('subscription_id', subscription.id)
    .eq('status', 'ACTIVE')
    // Add filter: Count packages updated (activated) within the current cycle
    .gte('updated_at', cycleStartDate.toISOString());

  if (error) {
    console.error(`Error counting active packages for subscription ${subscription.id} in current cycle:`, error);
    throw error; // Re-throw error
  }

  console.log(`Found ${count ?? 0} active packages in current cycle for subscription ${subscription.id}`);
  return count ?? 0;
}

export async function findAnyPackageByTracking(
  trackingNumber: string
): Promise<Package | null> {
  const tableName = getTableName('packages');
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq('tracking_number', trackingNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error finding package by tracking:', error);
    throw error;
  }
  return data;
}

// --- Notification Logging Function ---
/**
 * Logs a notification event to the notifications table.
 * @param params Object containing notification details
 * @returns {Promise<void>} Resolves when logging is complete
 */
export async function logNotification(params: {
  packageId: number;
  userId: number;
  notificationType: 'email' | 'sms';
  contactInfo: string;
  purpose: string;
  trackingNumber: string;
  status: string;
}): Promise<void> {
  const notificationsTable = getTableName('notifications');
  const {
    packageId,
    userId,
    notificationType,
    contactInfo,
    purpose,
    trackingNumber,
    status
  } = params;

  const { error } = await supabaseAdmin
    .from(notificationsTable)
    .insert([
      {
        package_id: packageId,
        user_id: userId,
        notification_type: notificationType,
        contact_info: contactInfo,
        purpose,
        tracking_number: trackingNumber,
        status
      }
    ]);

  if (error) {
    console.error('Error logging notification to database:', error);
    // Continue execution despite error in logging
  } else {
    console.log('Successfully logged notification to database');
  }
}
