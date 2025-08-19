import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent, ChangeEvent } from 'react';
import { authAPI } from '../services/api';
import { useTenant } from '../hooks/useTenant';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { tenant, loading: tenantLoading } = useTenant();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(credentials);
            console.log('Login response:', response);

            // Use auth context to handle login
            login(response.data.user, response.data.access_token);

            // Navigate to profile page
            navigate('/profile');

        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err && 
                err.response && typeof err.response === 'object' && 
                'data' in err.response && err.response.data &&
                typeof err.response.data === 'object' && 'message' in err.response.data
                ? String(err.response.data.message)
                : 'Login failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (tenantLoading) {
        return <div className="loading">Loading tenant information...</div>;
    }

    if (!tenant) {
        return (
            <div className="error">
                <h2>Tenant Not Found</h2>
                <p>The requested organization could not be found.</p>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="tenant-info">
                    <h2>{tenant.companyName}</h2>
                    <p>เข้าสู่ระบบบัญชีของคุณ</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            placeholder="กรอกชื่อผู้ใช้"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            placeholder="กรอกรหัสผ่าน"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* Demo credentials info */}
                <div className="demo-info">
                    <h4>🧪 ข้อมูลทดสอบ</h4>
                    <p>สำหรับการทดสอบระบบ:</p>
                    <div className="demo-credentials">
                        Username: admin<br/>
                        Password: password123
                    </div>
                    <p style={{ fontSize: '0.8em', marginTop: '10px', opacity: 0.7 }}>
                        ใช้ได้กับทุก subdomain (company-a, company-b, company-c)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;