import React from 'react';
import { Device } from '../types/device';
import { Cpu, HardDrive, MemoryStick as Memory, Monitor, Network, Package } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  if (device.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-700">Device {device.id} - Error</h3>
        <p className="text-red-600 mt-2">{device.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Device {device.id}</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Cpu className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-700">CPU</h4>
            <p className="text-sm text-gray-600">{device.hardware.cpu.model}</p>
            <p className="text-sm text-gray-600">{device.hardware.cpu.speed} - {device.hardware.cpu.cores} cores</p>
            <p className="text-sm text-gray-600">Size: {device.hardware.cpu.size}</p>
            <p className="text-sm text-gray-600">Data Width: {device.hardware.cpu.dataWidth}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Memory className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-700">RAM</h4>
            <p className="text-sm text-gray-600">{device.hardware.ram.capacity} {device.hardware.ram.type}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <HardDrive className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-700">Storage</h4>
            <p className="text-sm text-gray-600">{device.hardware.storage.type} - {device.hardware.storage.capacity}</p>
          </div>
        </div>

        {device.hardware.graphics && (
          <div className="flex items-start space-x-3">
            <Monitor className="w-5 h-5 text-yellow-500 mt-1" />
            <div>
              <h4 className="font-medium text-gray-700">Graphics</h4>
              <p className="text-sm text-gray-600">{device.hardware.graphics.model} - {device.hardware.graphics.memory}</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-indigo-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-700">Software</h4>
            <p className="text-sm text-gray-600">{device.software.os.name} {device.software.os.version}</p>
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-600">Installed Apps:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {device.software.installedApps.map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Network className="w-5 h-5 text-red-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-700">Network</h4>
            <p className="text-sm text-gray-600">
              Status: <span className={device.network.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {device.network.status}
              </span>
            </p>
            {device.network.type && (
              <p className="text-sm text-gray-600">Type: {device.network.type}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}