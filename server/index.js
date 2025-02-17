import express from 'express';
import cors from 'cors';
import si from 'systeminformation';
import sudo from 'sudo-prompt';
import ping from 'ping';
import { NodeSSH } from 'node-ssh';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ssh = new NodeSSH();
const PORT = process.env.PORT || 3001;
const SUBNET = process.env.SUBNET || '192.168.1.';
const SSH_USERNAME = process.env.SSH_USERNAME;
const SSH_PASSWORD = process.env.SSH_PASSWORD;

const validatePermissions = (req, res, next) => {
  const { permissions } = req.body;
  if (!permissions || !permissions.includes('network') || !permissions.includes('ssh')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

app.post('/api/system-info', validatePermissions, async (req, res) => {
  try {
    console.log('Fetching system information...');
    const [cpu, mem, graphics, disk, osInfo, processes] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.graphics(),
      si.diskLayout(),
      si.osInfo(),
      si.processes()
    ]);

    console.log('System information fetched successfully.');
    // Get unique applications from running processes
    const uniqueApps = [...new Set(processes.list.map(proc => proc.name))].sort();

    const systemInfo = {
      id: 1,
      hardware: {
        cpu: {
          model: cpu.manufacturer + ' ' + cpu.brand,
          speed: cpu.speed + ' GHz',
          cores: cpu.cores,
          size: cpu.physicalCores,
          dataWidth: cpu.vendor
        },
        ram: {
          capacity: Math.round(mem.total / (1024 * 1024 * 1024)) + 'GB',
          type: mem.type || 'Unknown'
        },
        storage: disk.map(drive => ({
          type: drive.type,
          capacity: Math.round(drive.size / (1024 * 1024 * 1024)) + 'GB'
        }))[0] || { type: 'Unknown', capacity: 'Unknown' },
        graphics: graphics.controllers.map(gpu => ({
          model: gpu.model,
          memory: (gpu.memoryTotal / 1024) + 'GB'
        }))[0]
      },
      software: {
        os: {
          name: osInfo.distro,
          version: osInfo.release
        },
        installedApps: uniqueApps.slice(0, 20) // Limit to first 20 apps for display
      },
      network: {
        status: 'connected', // We can assume connected since the API call worked
        type: 'Unknown' // Would need additional logic to determine exact type
      }
    };

    console.log('Sending system information response...');
    res.json(systemInfo);
    console.log('System information response sent successfully.');
  } catch (error) {
    console.error('Error fetching system information:', error);
    res.status(500).json({
      id: 1,
      error: 'Failed to retrieve system information',
      details: error.message
    });
  }
});

app.post('/api/admin-task', validatePermissions, (req, res) => {
  const options = {
    name: 'System Information App'
  };

  sudo.exec('some-command-that-requires-admin', options, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing admin task:', error);
      return res.status(500).json({ error: 'Failed to execute admin task', details: error.message });
    }
    res.json({ stdout, stderr });
  });
});

app.post('/api/network-devices', validatePermissions, async (req, res) => {
  try {
    console.log('Scanning network devices...');
    const devices = [];

    for (let i = 1; i <= 254; i++) {
      const host = `${SUBNET}${i}`;
      const isAlive = await ping.promise.probe(host);
      if (isAlive) {
        devices.push(host);
      }
    }

    console.log('Network devices scanned successfully.');
    res.json(devices);
  } catch (error) {
    console.error('Error scanning network devices:', error);
    res.status(500).json({
      error: 'Failed to scan network devices',
      details: error.message
    });
  }
});

app.post('/api/remote-system-info', validatePermissions, async (req, res) => {
  const { hosts, username, password } = req.body;

  try {
    const results = await Promise.all(hosts.map(async (host) => {
      try {
        console.log(`Connecting to remote system at ${host}...`);
        await ssh.connect({
          host,
          username,
          password
        });

        console.log('Connected to remote system.');
        const result = await ssh.execCommand('systeminfo');
        console.log('Remote system information retrieved successfully.');
        return { host, systemInfo: result.stdout };
      } catch (error) {
        console.error(`Error retrieving remote system information for ${host}:`, error);
        return { host, error: 'Failed to retrieve remote system information' };
      } finally {
        ssh.dispose();
        console.log('Disconnected from remote system.');
      }
    }));

    res.json(results);
  } catch (error) {
    console.error('Error retrieving remote system information:', error);
    res.status(500).json({
      error: 'Failed to retrieve remote system information',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});