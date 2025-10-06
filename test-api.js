const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    console.log('🧪 Testing Password Vault Authentication API\n');
    
    const testUser = {
        email: 'test@example.com',
        password: 'password123'
    };
    
    try {
        // Test 1: Register a new user
        console.log('1️⃣ Testing user registration...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
            console.log('✅ Registration successful:', registerResponse.data);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('ℹ️  User already exists (expected if running multiple times)');
            } else {
                console.log('❌ Registration failed:', error.response?.data || error.message);
            }
        }
        
        // Test 2: Login with valid credentials
        console.log('\n2️⃣ Testing user login...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/login`, testUser);
            console.log('✅ Login successful:', {
                message: loginResponse.data.message,
                hasToken: !!loginResponse.data.token,
                user: loginResponse.data.user
            });
        } catch (error) {
            console.log('❌ Login failed:', error.response?.data || error.message);
        }
        
        // Test 3: Login with invalid password
        console.log('\n3️⃣ Testing login with invalid password...');
        try {
            const invalidLoginResponse = await axios.post(`${BASE_URL}/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
            console.log('❌ Should have failed but got:', invalidLoginResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected invalid password:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }
        
        // Test 4: Login with non-existent user
        console.log('\n4️⃣ Testing login with non-existent user...');
        try {
            const nonExistentLoginResponse = await axios.post(`${BASE_URL}/login`, {
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            console.log('❌ Should have failed but got:', nonExistentLoginResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly rejected non-existent user:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }
        
        console.log('\n🎉 API testing completed!');
        
    } catch (error) {
        console.error('💥 Test suite failed:', error.message);
    }
}

// Run the tests
testAuth();


