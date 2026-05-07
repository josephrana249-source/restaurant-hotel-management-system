const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Replace standard background gradients in css
  content = content.replace(/background:\s*linear-gradient\([^;]+\);/g, (match) => {
    if (match.includes('--bg-secondary')) return 'background: var(--bg-secondary);';
    if (match.includes('#fff 0%')) return '/* gradient removed for pure color text */'; // handled below
    if (match.includes('to right, #fff, #94a3b8')) return '/* gradient removed for pure color text */'; // handled below
    if (match.includes('to top, var(--bg-card)')) return 'background: var(--bg-card);';
    if (match.includes('to top, var(--primary)')) return 'background: var(--primary);';
    if (match.includes('135deg, rgba(139, 92, 246, 0.35) 0%')) return 'background: rgba(139, 92, 246, 0.15);';
    if (match.includes('135deg, \n    rgba(139, 92, 246, 0.3) 0%')) return 'background: rgba(139, 92, 246, 0.15);';
    return 'background: var(--primary);';
  });

  // Multiline gradients in styles.css
  content = content.replace(/background:\s*linear-gradient\(135deg,\s*rgba\(139, 92, 246, 0\.3\) 0%,\s*rgba\(59, 130, 246, 0\.2\) 50%,\s*rgba\(139, 92, 246, 0\.15\) 100%\);/m, 'background: rgba(139, 92, 246, 0.15);');
  content = content.replace(/background:\s*linear-gradient\(135deg,\s*rgba\(139, 92, 246, 0\.35\) 0%,\s*rgba\(59, 130, 246, 0\.2\) 50%,\s*rgba\(139, 92, 246, 0\.15\) 100%\);/m, 'background: rgba(139, 92, 246, 0.15);');
  
  // Radial gradients in styles.css multiline
  content = content.replace(/background:\s*radial-gradient\(ellipse at 20% 50%, rgba\(139, 92, 246, 0\.2\) 0%, transparent 60%\),\s*radial-gradient\(ellipse at 80% 50%, rgba\(59, 130, 246, 0\.15\) 0%, transparent 60%\);/m, '');
  
  // Single line radial gradients
  content = content.replace(/background:\s*radial-gradient\([^;]+\);/g, '/* radial-gradient removed */');

  // Background clip text gradients
  content = content.replace(/background: linear-gradient\(135deg, var\(--primary\), var\(--primary-light\)\);\s*-webkit-background-clip: text;\s*-webkit-text-fill-color: transparent;\s*background-clip: text;/g, 'color: var(--primary);');
  content = content.replace(/background: linear-gradient\(to right, #fff, #94a3b8\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;/g, 'color: #fff;');
  content = content.replace(/background: linear-gradient\(135deg, #fff 0%, #cbd5e1 100%\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;/g, 'color: #fff;');

  // Background image with gradient + url
  content = content.replace(/background-image:\s*linear-gradient\(to bottom, rgba\(11, 14, 20, 0\.7\) 0%, rgba\(11, 14, 20, 0\.4\) 100%\),\s*url\('([^']+)'\);/m, "background-image: url('$1');");

  // Inline styles in pages.js / app.js
  content = content.replace(/background:linear-gradient\(135deg,rgba\(139,92,246,0\.2\),rgba\(139,92,246,0\.05\)\)/g, 'background:rgba(139,92,246,0.15)');
  content = content.replace(/background:linear-gradient\(135deg,rgba\(59,130,246,0\.2\),rgba\(59,130,246,0\.05\)\)/g, 'background:rgba(59,130,246,0.15)');
  content = content.replace(/background:linear-gradient\(135deg,rgba\(139,92,246,0\.15\),rgba\(139,92,246,0\.05\)\)/g, 'background:rgba(139,92,246,0.15)');
  content = content.replace(/background:linear-gradient\(135deg,rgba\(59,130,246,0\.15\),rgba\(59,130,246,0\.05\)\)/g, 'background:rgba(59,130,246,0.15)');
  content = content.replace(/background:linear-gradient\(135deg,\s*var\(--primary\),\s*var\(--primary-light\)\)/g, 'background:var(--primary)');

  fs.writeFileSync(path, content, 'utf8');
}

const files = [
  'c:/Users/USER/Desktop/RHMS/styles.css',
  'c:/Users/USER/Desktop/RHMS/pages.js',
  'c:/Users/USER/Desktop/RHMS/app.js',
  'c:/Users/USER/Desktop/RHMS/components.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    processFile(f);
  }
});
console.log('done');
