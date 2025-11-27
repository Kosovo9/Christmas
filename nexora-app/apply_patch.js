const fs = require('fs');
const path = 'c:\\Christmas\\nexora-app\\node_modules\\@cloudflare\\next-on-pages\\dist\\index.js';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Regex to match: await l4`$ ${n4} --version`
    // We match: await l4`$ ${...} --version`
    const regex = /await l4`\$ \$\{[^}]+\} --version`/g;

    if (regex.test(content)) {
        console.log('Found target code. Patching...');
        const newContent = content.replace(regex, 'await Promise.resolve({ stdout: "10.0.0" })');
        fs.writeFileSync(path, newContent);
        console.log('Patched successfully!');
    } else {
        console.log('Target code not found with regex. Trying literal string match for n4...');
        // Fallback to literal match if regex fails (maybe formatting is different)
        const literal = 'await l4`$ ${n4} --version`';
        if (content.includes(literal)) {
            console.log('Found literal string. Patching...');
            const newContent = content.replace(literal, 'await Promise.resolve({ stdout: "10.0.0" })');
            fs.writeFileSync(path, newContent);
            console.log('Patched successfully!');
        } else {
            console.log('Could not find target code to patch.');
        }
    }
} catch (e) {
    console.error('Error:', e);
}
