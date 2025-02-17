import { useEffect, useState } from 'react';

interface SystemInfoCPU {
  manufacturer: string;
  brand: string;
  physicalCores: number;
  speed: number;
  speedMax: number;
  temperature: number | null;
}

interface SystemInfoData {
  cpu: SystemInfoCPU;
}

// Declare the electron API exposed by preload
declare global {
  interface Window {
    electron: {
      getSystemInfo: () => Promise<SystemInfoData>;
      subscribeToSystemInfo: (callback: (data: SystemInfoData) => void) => Promise<() => void>;
    };
  }
}

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfoData | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Initial fetch
    window.electron.getSystemInfo().then(setSystemInfo);

    // Subscribe to updates
    window.electron.subscribeToSystemInfo((info: SystemInfoData) => {
      setSystemInfo(info);
    }).then((unsubscribe: () => void) => {
      cleanup = unsubscribe;
    });

    // Cleanup on component unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  if (!systemInfo) {
    return <div>Loading system information...</div>;
  }

  return (
    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-4">System Information</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium">CPU: </span>
          {systemInfo.cpu.brand}
        </div>
        <div>
          <span className="font-medium">Cores: </span>
          {systemInfo.cpu.physicalCores}
        </div>
        <div>
          <span className="font-medium">Current Speed: </span>
          {systemInfo.cpu.speed.toFixed(2)} GHz
        </div>
        <div>
          <span className="font-medium">Max Speed: </span>
          {systemInfo.cpu.speedMax.toFixed(2)} GHz
        </div>
        <div>
          <span className="font-medium">Temperature: </span>
          {systemInfo.cpu.temperature ? `${systemInfo.cpu.temperature.toFixed(1)}°C` : 'N/A'}
        </div>
      </div>
    </div>
  );
}
