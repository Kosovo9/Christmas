const fs = require('fs');
const path = 'c:\\Christmas\\nexora-app\\node_modules\\@cloudflare\\next-on-pages\\dist\\index.js';

try {
    let content = fs.readFileSync(path, 'utf8');
    const regex = /--version/g;
    let match;
    let count = 0;
    while ((match = regex.exec(content)) !== null) {
        count++;
        if (count < 20) {
            const start = Math.max(0, match.index - 50);
            const end = Math.min(content.length, match.index + 50);
            console.log(`Match ${count}: ...${content.substring(start, end)}...`);
        }
    }
} catch (e) {
    console.error('Error:', e);
}
