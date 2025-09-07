const https = require('https');

function getCurrentIP() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    });
    req.on('error', reject);
  });
}

async function main() {
  try {
    console.log('🔍 Detecting your current IP address...');
    const currentIP = await getCurrentIP();
    console.log(`🌐 Your current IP address: ${currentIP}`);
    console.log('\n📋 MongoDB Atlas Whitelist Instructions:');
    console.log('1. Go to: https://cloud.mongodb.com/');
    console.log('2. Select your "toy" project');
    console.log('3. Click "Network Access" in left sidebar');
    console.log('4. Click "ADD IP ADDRESS"');
    console.log(`5. Add this IP: ${currentIP}`);
    console.log('6. Click "Confirm"');
    console.log('7. Wait 1-2 minutes for changes to take effect');
    console.log('\n💡 Alternative: Add 0.0.0.0/0 to allow all IPs (for testing only)');
  } catch (error) {
    console.error('❌ Error getting IP:', error.message);
  }
}

main();
