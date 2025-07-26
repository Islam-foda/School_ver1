import { useState } from 'react';
import { setupInitialUsers } from '../services/setupUsers';

const SetupUsers = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setMessage('');

    try {
      await setupInitialUsers();
      setMessage('Users created successfully! You can now login with:\nAdmin: admin@school.com / admin123\nUser: user@school.com / user123');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Setup Initial Users
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This will create admin and user accounts for testing
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSetup}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating Users...' : 'Create Initial Users'}
          </button>

          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{message}</pre>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p className="font-semibold">This will create:</p>
            <p>• Admin: admin@school.com / admin123</p>
            <p>• User: user@school.com / user123</p>
            <p className="mt-2 text-xs">⚠️ Only run this once!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupUsers; 