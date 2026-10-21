const baseUrl = 'https://all-core-school-erp-backend.onrender.com/api';

async function run() {
  console.log("Registering Khushi using POST /api/auth/register...");
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'khushi',
        email: 'khushi@school.com',
        password: 'password123',
        roleName: 'Student'
      })
    });
    
    const data = await res.json();
    console.log("Registration Response:", data);

    if (data.success || data.message.includes('already exists')) {
       console.log("\n==================================");
       console.log("SUCCESS! KHUSHI ACCOUNT CREATED.");
       console.log("Email: khushi@school.com");
       console.log("Password: password123");
       console.log("==================================\n");
    }
  } catch(e) {
    console.error("API Error:", e);
  }
}
run();
