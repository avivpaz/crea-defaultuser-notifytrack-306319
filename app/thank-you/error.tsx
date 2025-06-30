'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'An error occurred while processing your request.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="inline-block bg-[#333366] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#282855] transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-block border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 