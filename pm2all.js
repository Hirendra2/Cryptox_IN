const { exec } = require('child_process');

function restartServers() {
  exec('pm2 restart all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting servers: ${error}`);
    } else {
      console.log(`Servers restarted: ${stdout}`);
    }
  });
}

setInterval(restartServers, 60 * 60 * 1000); // Restart every 1 hour
