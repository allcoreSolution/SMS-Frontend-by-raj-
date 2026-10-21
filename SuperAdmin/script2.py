import os
import re

target_dir = r"C:\Users\lOQ\Desktop\SCHOOL_ERP\SuperAdmin_Dashboard\src\pages\settings"

files_to_update = [
    "AcademicWordingSettings.jsx",
    "AiManagementSettings.jsx",
    "ApiDocumentationSettings.jsx",
    "AppBrandingSettings.jsx",
    "AppDistributionSettings.jsx",
    "CommsWalletSettings.jsx",
    "LoginPageDesignsSettings.jsx",
    "MailSmtpSettings.jsx",
    "MetaDltConfigSettings.jsx",
    "PaymentSettingsPage.jsx",
    "PushNotificationsSettings.jsx",
    "RegistrationSettings.jsx",
    "ServerHealthSettings.jsx",
    "SubscriptionsSettings.jsx",
    "TelegramBotSettings.jsx",
    "WhatsAppGatewaySettings.jsx"
]

for filename in files_to_update:
    filepath = os.path.join(target_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    
    # 1. Remove Demo mode text and adjacent markup accurately avoiding swallowing siblings.
    # The banner looks like:
    # {/* Demo Banner */}
    # <div className="bg-amber-50...">
    #   <Lock ... />
    #   <span><strong>Demo mode:</strong> ...</span>
    # </div>
    
    # We will match `{/* Demo Banner */}` (optional) and the following `<div...` which contains `Demo mode:` up to its FIRST closing `</div>`.
    
    pattern1 = re.compile(
        r'\{/\*\s*Demo.*?Banner\s*\*/\}\s*<div[^>]*bg-amber-50[^>]*>.*?Demo mode:.*?</div>', 
        re.DOTALL
    )
    content = pattern1.sub('', content)

    # In case it doesn't have the comment
    pattern2 = re.compile(
        r'<div[^>]*bg-amber-50[^>]*>\s*<Lock[^>]*>\s*<span[^>]*><strong[^>]*>Demo mode:.*?</span>\s*</div>',
        re.DOTALL
    )
    content = pattern2.sub('', content)
    
    # In case it uses #fff9e6 instead of bg-amber-50
    pattern3 = re.compile(
        r'\{/\*\s*Demo.*?Banner\s*\*/\}\s*<div[^>]*#fff9e6[^>]*>.*?Demo mode:.*?</div>', 
        re.DOTALL
    )
    content = pattern3.sub('', content)

    # And without comment
    pattern4 = re.compile(
        r'<div[^>]*#fff9e6[^>]*>\s*<Lock[^>]*>\s*<span[^>]*><strong[^>]*>Demo mode:.*?</span>\s*</div>',
        re.DOTALL
    )
    content = pattern4.sub('', content)

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
    
    # also handle `handleSave` in CommsWalletSettings (they are 3 identical ones)

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
