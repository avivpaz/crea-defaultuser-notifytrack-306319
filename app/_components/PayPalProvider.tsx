'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

interface PayPalProviderProps {
    children: React.ReactNode;
}

const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
    if (!PAYPAL_CLIENT_ID) {
        console.error("PayPal Client ID is not set. PayPal Buttons will not work.");
        // Render children without the provider if ID is missing
        return <>{children}</>;
    }

    const initialOptions = {
        clientId: PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture", // Default intent, can be overridden by button props
        vault: true 
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            {children}
        </PayPalScriptProvider>
    );
};

export default PayPalProvider; 