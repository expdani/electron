import si from 'systeminformation';

export async function getSystemInfo() {
  try {
    const [cpu, temp] = await Promise.all([
      si.cpu(),
      si.cpuTemperature(),
    ]);

    return {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        physicalCores: cpu.physicalCores,
        speed: cpu.speed,
        speedMax: cpu.speedMax,
        temperature: temp.main,
      },
    };
  } catch (error) {
    console.error('Error getting system information:', error);
    throw error;
  }
}

// Update system info every second
export async function subscribeToSystemInfo(callback: (data: any) => void) {
  const updateInfo = async () => {
    try {
      const info = await getSystemInfo();
      callback(info);
    } catch (error) {
      console.error('Error updating system information:', error);
    }
  };

  // Initial update
  await updateInfo();
  
  // Set up interval for updates
  const intervalId = setInterval(updateInfo, 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}
