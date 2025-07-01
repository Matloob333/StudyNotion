const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build environment...');

// Check current directory
console.log('📁 Current directory:', process.cwd());
console.log('📁 Directory contents:', fs.readdirSync('.'));

// Check if client directory exists
const clientPath = path.join(process.cwd(), 'client');
if (fs.existsSync(clientPath)) {
    console.log('✅ Client directory exists');
    console.log('📁 Client directory contents:', fs.readdirSync(clientPath));
    
    // Check if public directory exists
    const publicPath = path.join(clientPath, 'public');
    if (fs.existsSync(publicPath)) {
        console.log('✅ Public directory exists');
        console.log('📁 Public directory contents:', fs.readdirSync(publicPath));
        
        // Check if index.html exists
        const indexPath = path.join(publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            console.log('✅ index.html exists');
            console.log('📄 index.html size:', fs.statSync(indexPath).size, 'bytes');
        } else {
            console.log('❌ index.html not found');
        }
    } else {
        console.log('❌ Public directory not found');
    }
} else {
    console.log('❌ Client directory not found');
}

console.log('🏁 Test completed'); 