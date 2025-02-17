export interface Device {
  id: number;
  hardware: {
    cpu: {
      model: string;
      speed: string;
      cores: number;
      size: number;
      dataWidth: string;
    };
    ram: {
      capacity: string;
      type: string;
    };
    storage: {
      type: string;
      capacity: string;
    };
    graphics?: {
      model: string;
      memory: string;
    };
  };
  software: {
    os: {
      name: string;
      version: string;
    };
    installedApps: string[];
  };
  network: {
    status: 'connected' | 'disconnected';
    type: 'Ethernet' | 'Wi-Fi' | 'Other' | null;
  };
  error?: string;
}