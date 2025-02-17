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

declare module '#preload' {
  export function getSystemInfo(): Promise<SystemInfoData>;
  export function subscribeToSystemInfo(
    callback: (data: SystemInfoData) => void
  ): Promise<() => void>;

  // Include other preload functions that might be used
  export function sha256sum(text: string): string;
  export function versions(): Record<string, string>;
  export function send(channel: string, message: string): Promise<unknown>;
}
