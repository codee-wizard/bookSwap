const API_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: 'test_' + Date.now() + '@example.com',
        password: 'password123',
        fullName: 'Test User',
        location: 'Test City'
    };

    try {
        console.log('Attempting registration...');
        const registerRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const registerData = await registerRes.json();
        console.log('Registration status:', registerRes.status);
        console.log('Registration response:', registerData);

        if (!registerRes.ok) {
            throw new Error('Registration failed');
        }

        console.log('Attempting login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });

        const loginData = await loginRes.json();
        console.log('Login status:', loginRes.status);
        console.log('Login response:', loginData);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAuth();
