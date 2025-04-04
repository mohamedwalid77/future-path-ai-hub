
const localtunnel = require('localtunnel');
const { spawn } = require('child_process');
const chalk = require('chalk') || { green: (text) => text, blue: (text) => text };

console.log(chalk.green('Starting development server...'));
const devServer = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

// Wait a bit for the dev server to start before creating the tunnel
setTimeout(async () => {
  try {
    console.log(chalk.green('Creating tunnel to development server...'));
    const tunnel = await localtunnel({ port: 8080 });
    
    console.log(chalk.green('\n🚀 Your app is now available at:'));
    console.log(chalk.blue(tunnel.url));
    console.log(chalk.green('\nShare this URL to allow anyone to access your development server.\n'));
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(1);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Closing tunnel and shutting down...');
      tunnel.close();
      devServer.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error creating tunnel:', error);
    devServer.kill();
    process.exit(1);
  }
}, 3000);
