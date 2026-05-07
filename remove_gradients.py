import re

def process_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        def repl_standard(m):
            match_str = m.group(0)
            if '--bg-secondary' in match_str: return 'background: var(--bg-secondary);'
            if '#fff 0%' in match_str: return '/* gradient removed for pure color text */'
            if 'to right, #fff, #94a3b8' in match_str: return '/* gradient removed for pure color text */'
            if 'to top, var(--bg-card)' in match_str: return 'background: var(--bg-card);'
            if 'to top, var(--primary)' in match_str: return 'background: var(--primary);'
            if 'rgba(139, 92, 246, 0.35) 0%' in match_str: return 'background: rgba(139, 92, 246, 0.15);'
            if 'rgba(139, 92, 246, 0.3) 0%' in match_str: return 'background: rgba(139, 92, 246, 0.15);'
            return 'background: var(--primary);'

        content = re.sub(r'background:\s*linear-gradient\([^;]+\);', repl_standard, content)
        
        # Multiline gradients
        content = re.sub(r'background:\s*linear-gradient\(135deg,\s*rgba\(139, 92, 246, 0\.3\) 0%,\s*rgba\(59, 130, 246, 0\.2\) 50%,\s*rgba\(139, 92, 246, 0\.15\) 100%\);', 'background: rgba(139, 92, 246, 0.15);', content, flags=re.MULTILINE)
        content = re.sub(r'background:\s*linear-gradient\(135deg,\s*rgba\(139, 92, 246, 0\.35\) 0%,\s*rgba\(59, 130, 246, 0\.2\) 50%,\s*rgba\(139, 92, 246, 0\.15\) 100%\);', 'background: rgba(139, 92, 246, 0.15);', content, flags=re.MULTILINE)
        
        # Radial muliline
        content = re.sub(r'radial-gradient\(ellipse at 20% 50%, rgba\(139, 92, 246, 0\.2\) 0%, transparent 60%\),\s*radial-gradient\(ellipse at 80% 50%, rgba\(59, 130, 246, 0\.15\) 0%, transparent 60%\)', 'none', content, flags=re.MULTILINE)
        
        content = re.sub(r'background:\s*radial-gradient\([^;]+\);', '/* radial-gradient removed */', content)
        
        content = re.sub(r'background: linear-gradient\(135deg, var\(--primary\), var\(--primary-light\)\);\s*-webkit-background-clip: text;\s*-webkit-text-fill-color: transparent;\s*background-clip: text;', 'color: var(--primary);', content)
        content = re.sub(r'background: linear-gradient\(to right, #fff, #94a3b8\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;', 'color: #fff;', content)
        content = re.sub(r'background: linear-gradient\(135deg, #fff 0%, #cbd5e1 100%\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;', 'color: #fff;', content)
        
        content = re.sub(r"background-image:\s*linear-gradient\(to bottom, rgba\(11, 14, 20, 0\.7\) 0%, rgba\(11, 14, 20, 0\.4\) 100%\),\s*url\('([^']+)'\);", r"background-image: url('\1');", content, flags=re.MULTILINE)
        
        content = content.replace('background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(139,92,246,0.05))', 'background:rgba(139,92,246,0.15)')
        content = content.replace('background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(59,130,246,0.05))', 'background:rgba(59,130,246,0.15)')
        content = content.replace('background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.05))', 'background:rgba(139,92,246,0.15)')
        content = content.replace('background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.05))', 'background:rgba(59,130,246,0.15)')
        content = content.replace('background:linear-gradient(135deg, var(--primary), var(--primary-light))', 'background:var(--primary)')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error processing {path}: {e}")

files = [
    r'c:\Users\USER\Desktop\RHMS\styles.css',
    r'c:\Users\USER\Desktop\RHMS\pages.js',
    r'c:\Users\USER\Desktop\RHMS\app.js',
    r'c:\Users\USER\Desktop\RHMS\components.js'
]

for f in files:
    process_file(f)
print("done")
