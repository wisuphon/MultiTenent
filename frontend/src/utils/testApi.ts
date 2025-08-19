// Test utility functions for API endpoints
import { authAPI } from '../services/api';

// Test function to check tenant detection
export const testTenantDetection = async () => {
    try {
        console.log('🧪 Testing tenant detection...');
        console.log('Current host:', window.location.host);
        
        const response = await authAPI.getTenant();
        console.log('✅ Tenant detected:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Tenant detection failed:', error);
        throw error;
    }
};

// Test function for login
export const testLogin = async (username: string = 'admin', password: string = 'password123') => {
    try {
        console.log('🧪 Testing login...');
        const response = await authAPI.login({ username, password });
        console.log('✅ Login successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Login failed:', error);
        throw error;
    }
};

// Test function for profile (requires login first)
export const testProfile = async () => {
    try {
        console.log('🧪 Testing profile...');
        const response = await authAPI.getProfile();
        console.log('✅ Profile retrieved:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Profile failed:', error);
        throw error;
    }
};

// Complete test suite
export const runFullTest = async () => {
    console.log('🚀 Running complete API test suite...');
    
    try {
        // Test 1: Tenant detection
        const tenant = await testTenantDetection();
        
        // Test 2: Login
        const loginResult = await testLogin();
        
        // Test 3: Profile (now that we have a token)
        const profile = await testProfile();
        
        console.log('✅ All tests passed!');
        return { tenant, loginResult, profile };
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        throw error;
    }
};

// Make functions available globally for console testing
declare global {
    interface Window {
        testTenant: () => Promise<any>;
        testLogin: (username?: string, password?: string) => Promise<any>;
        testProfile: () => Promise<any>;
        runFullTest: () => Promise<any>;
    }
}

if (typeof window !== 'undefined') {
    window.testTenant = testTenantDetection;
    window.testLogin = testLogin;
    window.testProfile = testProfile;
    window.runFullTest = runFullTest;
}