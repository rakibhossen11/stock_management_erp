'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../providers/AuthProvider';

function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user?.name}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-lg font-medium">Your Dashboard Content</h2>
              <p className="mt-2 text-gray-600">
                This is a protected page. Only authenticated users can see this content.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;