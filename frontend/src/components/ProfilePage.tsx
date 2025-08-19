import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useTenant } from '../hooks/useTenant';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import './Profile.css';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { tenant } = useTenant();
    const { logout } = useAuth();

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                // Try to get user from localStorage first
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('access_token');
                
                console.log('Stored token:', token);
                console.log('Stored user:', storedUser);
                
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    console.log('User data loaded from localStorage:', userData);
                }

                // Only fetch fresh data if we have a valid token
                if (token && token !== '') {
                    try {
                        const response = await authAPI.getProfile();
                        setUser(response.data as User);
                        console.log('Fresh profile data:', response.data);
                    } catch (profileError) {
                        console.warn('Failed to fetch fresh profile, using stored data:', profileError);
                        // Don't logout immediately, use the stored data
                    }
                } else {
                    console.warn('No valid access token found');
                    if (storedUser) {
                        // We have user data but no token, this is okay for display
                        console.log('Using stored user data without token verification');
                    }
                }
            } catch (err: unknown) {
                console.error('Profile load error:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const handleLogout = () => {
        logout();
        // Navigation will be handled by the auth context and routes
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading">กำลังโหลดข้อมูลผู้ใช้...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="profile-container">
                <div className="error">
                    <h2>เกิดข้อผิดพลาด</h2>
                    <p>{error || 'ไม่พบข้อมูลผู้ใช้'}</p>
                    <button onClick={handleLogout} className="logout-btn">
                        กลับสู่หน้าเข้าสู่ระบบ
                    </button>
                </div>
            </div>
        );
    }

    const getRoleDisplayName = (role: string) => {
        const roleNames: { [key: string]: string } = {
            'ADMIN': 'ผู้ดูแลระบบ',
            'MANAGER': 'ผู้จัดการ',
            'USER': 'ผู้ใช้งาน'
        };
        return roleNames[role] || role;
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="tenant-info">
                    <h1>{user.tenant?.companyName || tenant?.companyName || 'บริษัท'}</h1>
                    <p className="subdomain">({user.tenant?.subdomain || tenant?.subdomain}.localhost)</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    ออกจากระบบ
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">
                            {user.firstName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="profile-info">
                        <h2 className="user-name">
                            {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.username
                            }
                        </h2>
                        <p className="user-role">{getRoleDisplayName(user.role)}</p>
                    </div>

                    <div className="profile-details">
                        <div className="detail-group">
                            <label>ชื่อผู้ใช้:</label>
                            <span>{user.username}</span>
                        </div>

                        {user.email && (
                            <div className="detail-group">
                                <label>อีเมล:</label>
                                <span>{user.email}</span>
                            </div>
                        )}

                        <div className="detail-group">
                            <label>ตำแหน่ง:</label>
                            <span>{getRoleDisplayName(user.role)}</span>
                        </div>

                        <div className="detail-group">
                            <label>บริษัท:</label>
                            <span>{user.tenant?.companyName || 'ไม่ระบุ'}</span>
                        </div>

                        <div className="detail-group">
                            <label>Subdomain:</label>
                            <span>{user.tenant?.subdomain || 'ไม่ระบุ'}</span>
                        </div>

                        {user.tenant?.createdAt && (
                            <div className="detail-group">
                                <label>สมาชิกเมื่อ:</label>
                                <span>{formatDate(user.tenant.createdAt)}</span>
                            </div>
                        )}
                    </div>

                    <div className="profile-actions">
                        <button className="edit-profile-btn" disabled>
                            แก้ไขข้อมูล (ยังไม่พร้อมใช้งาน)
                        </button>
                        <button onClick={handleLogout} className="logout-btn secondary">
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;