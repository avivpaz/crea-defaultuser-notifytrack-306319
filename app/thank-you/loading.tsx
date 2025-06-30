export default function Loading() {
  return (
    <main className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-6">
            {/* Loading Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Loading Title and Text */}
            <div className="space-y-3">
              <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>

            {/* Loading Info Box */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>

            {/* Loading Button */}
            <div className="flex justify-center">
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 