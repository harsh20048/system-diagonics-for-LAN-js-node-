export async function getSystemInfo(permissions: string[]) {
  try {
    console.log('Requesting system information...');
    const response = await fetch('/api/system-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissions })
    });
    console.log('Request sent to /api/system-info with permissions:', permissions);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Failed to fetch system information:', errorDetails);
      throw new Error(`Failed to fetch system information: ${errorDetails.error}`);
    }
    console.log('System information received successfully.');
    const data = await response.json();
    console.log('System information data:', data);
    return data;
  } catch (error) {
    console.error('Error getting system info:', error);
    return {
      id: 1,
      error: 'Failed to retrieve system information',
      details: error.message
    };
  }
}

export async function executeAdminTask(permissions: string[]) {
  try {
    console.log('Requesting admin task execution...');
    const response = await fetch('/api/admin-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissions })
    });
    console.log('Request sent to /api/admin-task with permissions:', permissions);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Failed to execute admin task:', errorDetails);
      throw new Error(`Failed to execute admin task: ${errorDetails.error}`);
    }
    console.log('Admin task executed successfully.');
    const data = await response.json();
    console.log('Admin task data:', data);
    return data;
  } catch (error) {
    console.error('Error executing admin task:', error);
    return { error: 'Failed to execute admin task', details: error.message };
  }
}

export async function getRemoteSystemInfo(hosts: string[], username: string, password: string) {
  try {
    console.log('Requesting remote system information...');
    const response = await fetch('/api/remote-system-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hosts, username, password })
    });
    console.log('Request sent to /api/remote-system-info with hosts:', hosts);
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Failed to fetch remote system information:', errorDetails);
      throw new Error(`Failed to fetch remote system information: ${errorDetails.error}`);
    }
    console.log('Remote system information received successfully.');
    const data = await response.json();
    console.log('Remote system information data:', data);
    return data;
  } catch (error) {
    console.error('Error getting remote system info:', error);
    return {
      error: 'Failed to retrieve remote system information',
      details: error.message
    };
  }
}