import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import { useSubdomain } from '../hooks/useSubdomain';
import { TenantContext } from './context';
import type { Tenant } from '../types';

interface TenantProviderProps {
    children: ReactNode;
}

const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { subdomain, isLoading: subdomainLoading } = useSubdomain();

    useEffect(() => {
        const fetchTenant = async () => {
            if (subdomainLoading) return;

            try {
                setLoading(true);
                const response = await authAPI.getTenant();
                console.log('Tenant fetch response:', response);
                setTenant(response.data);
                setError(null);
            } catch (err: unknown) {
                setError('Tenant not found');
                console.error('Tenant fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [subdomain, subdomainLoading]);

    return (
        <TenantContext.Provider value={{
            tenant,
            loading,
            error,
            subdomain
        }}>
            {children}
        </TenantContext.Provider>
    );
};

export default TenantProvider;