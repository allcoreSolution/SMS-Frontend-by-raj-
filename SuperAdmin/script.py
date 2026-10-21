import os
import re

target_dir = r"C:\Users\lOQ\Desktop\SCHOOL_ERP\SuperAdmin_Dashboard\src\pages\settings"

for filename in os.listdir(target_dir):
    if not filename.endswith(".jsx"):
        continue

    filepath = os.path.join(target_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    
    # 1. Remove Demo mode text and adjacent markup.
    # We will search for a block that contains "Demo mode:"
    # It might be an HTML block like `{/* Demo Banner */} <div>...</div>` or just `{/* Demo mode ... */} <div>...</div>`
    # We'll use a broad regex that matched the div containing "Demo mode:" up to its closing tag safely.
    # Note: Regex parsing HTML is tricky, but since it's a fixed format, we can do it.
    demo_banner_pattern = re.compile(
        r'\{/\*\s*Demo.*?Banner\s*\*/\}\s*<div[^>]*>.*?Demo mode:.*?</div>\s*</div>', 
        re.DOTALL
    )
    content = demo_banner_pattern.sub('', content)
    
    # Also handle the variant without the extra closing div if any
    demo_banner_pattern_2 = re.compile(
        r'\{/\*\s*Demo.*?Banner\s*\*/\}\s*<div[^>]*>.*?Demo mode:.*?</div>', 
        re.DOTALL
    )
    content = demo_banner_pattern_2.sub('', content)

    # Some of them don't have the comment `{/* Demo Banner */}` but have the banner
    demo_banner_pattern_3 = re.compile(
        r'<div[^>]*>\s*<Lock[^>]*>\s*<span[^>]*><strong[^>]*>Demo mode:.*?</span>\s*</div>',
        re.DOTALL
    )
    content = demo_banner_pattern_3.sub('', content)

    # 2. Modify handleSave
    save_pattern = r'const handleSave = \(\) => \{ setSaved\(true\); setTimeout\(\(\) => setSaved\(false\), 2500\); \};'
    new_save = """const handleSave = () => { 
    setSaved(true); 
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been saved successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSaved(false), 2500); 
  };"""
    content = re.sub(save_pattern, new_save, content)

    # Check if we successfully added Swal, if so, we need to import it.
    if 'Swal.fire' in content and 'import Swal' not in content:
        # Add import after the last import statement
        import_pattern = r"(import .*?;\n)"
        imports = re.findall(import_pattern, content)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + "import Swal from 'sweetalert2';\n")
        else:
            # Fallback
            content = "import Swal from 'sweetalert2';\n" + content

    if content != original_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filename}")
