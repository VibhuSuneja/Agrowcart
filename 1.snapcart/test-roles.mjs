// Native fetch used

const baseUrl = 'http://localhost:3000';

async function register(name, email, password, role) {
    console.log(`Registering ${role}: ${email}...`);
    const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    console.log(`Response:`, data);
    return data;
}

async function test() {
    try {
        await register("Test SHG", `shg_${Date.now()}@example.com`, "password123", "shg");
        await register("Test Processor", `proc_${Date.now()}@example.com`, "password123", "processor");
        console.log("Registration successful!");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
