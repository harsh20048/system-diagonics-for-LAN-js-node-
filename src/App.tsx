import React, { useState, useEffect } from 'react';
import { Device } from './types/device';
import { DeviceCard } from './components/DeviceCard';
import { RefreshCw, Shield } from 'lucide-react';
import { getSystemInfo, executeAdminTask, getRemoteSystemInfo } from './utils/systemInfo';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<Date>();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [hosts, setHosts] = useState<string[]>([]);

  const requestPermissions = () => {
    const userPermissions = prompt('Enter required permissions (comma-separated):', 'network,ssh');
    if (userPermissions) {
      setPermissions(userPermissions.split(',').map(p => p.trim()));
    }
  };

  const requestHosts = () => {
    const userHosts = prompt('Enter host IDs (comma-separated):', '192.168.1.1,192.168.1.2');
    if (userHosts) {
      setHosts(userHosts.split(',').map(h => h.trim()));
    }
  };

  const scanDevices = async () => {
    setLoading(true);
    try {
      const localDevice = await getSystemInfo(permissions);
      setDevices([localDevice]);
      setLastScan(new Date());
    } catch (error) {
      console.error('Error scanning devices:', error);
      setDevices([{
        id: 1,
        error: 'Failed to scan device information'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminTask = async () => {
    try {
      const result = await executeAdminTask(permissions);
      console.log('Admin task result:', result);
    } catch (error) {
      console.error('Error executing admin task:', error);
    }
  };

  const scanRemoteDevices = async () => {
    setLoading(true);
    try {
      const username = prompt('Enter SSH username:');
      const password = prompt('Enter SSH password:');
      if (username && password) {
        const remoteDevices = await getRemoteSystemInfo(hosts, username, password);
        setDevices(remoteDevices);
        setLastScan(new Date());
      }
    } catch (error) {
      console.error('Error scanning remote devices:', error);
      setDevices([{
        id: 1,
        error: 'Failed to scan remote device information'
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
    requestHosts();
    scanDevices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Device Diagnostics</h1>
            {lastScan && (
              <p className="text-sm text-gray-500 mt-1">
                Last scan: {lastScan.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={scanDevices}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Scanning...' : 'Scan Devices'}
            </button>
            <button
              onClick={scanRemoteDevices}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Scanning Remote...' : 'Scan Remote Devices'}
            </button>
            <button
              onClick={handleAdminTask}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Shield className="w-4 h-4 mr-2" />
              Execute Admin Task
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold text-blue-900 bg-blue-100 rounded-lg">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Scanning for devices...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;