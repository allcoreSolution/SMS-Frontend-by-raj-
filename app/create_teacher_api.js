const baseUrl = 'https://all-core-school-erp-backend.onrender.com/api';

async function run() {
  console.log("Registering Rajesh Teacher using POST /api/auth/register...");
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Rajesh Sharma',
        email: 'rajesh.sharma@school.edu',
        password: 'teacher123',
        roleName: 'Teacher'
      })
    });
    
    const data = await res.json();
    console.log("Registration Response:", data);

    if (data.success || data.message.includes('already exists')) {
       console.log("\n==================================");
       console.log("SUCCESS! TEACHER ACCOUNT CREATED.");
       console.log("Email: rajesh.sharma@school.edu");
       console.log("Password: teacher123");
       console.log("==================================\n");
    }
  } catch(e) {
    console.error("API Error:", e);
  }
}
run();
