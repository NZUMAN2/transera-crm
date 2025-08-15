const crypto = require('crypto');

// Generate secure random keys
const generateKey = (length = 32) => {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
};

console.log('🔐 Generated Secure Keys:\n');
console.log(`JWT_SECRET=${generateKey(32)}`);
console.log(`NEXT_PUBLIC_ENCRYPTION_KEY=${generateKey(32)}`);
console.log(`NEXTAUTH_SECRET=${generateKey(32)}`);
console.log('\n⚠️  Copy these to your .env.local file and Vercel dashboard!');