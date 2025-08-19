import { useState, useEffect } from 'react';

interface UseSubdomainReturn {
    subdomain: string;
    isLoading: boolean;
}

export const useSubdomain = (): UseSubdomainReturn => {
    const [subdomain, setSubdomain] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const extractSubdomain = () => {
            const host = window.location.host;
            const hostWithoutPort = host.split(':')[0];
            const parts = hostWithoutPort.split('.');

            // Handle localhost subdomains (e.g., company-a.localhost)
            if (hostWithoutPort.includes('localhost')) {
                if (parts.length > 1 && parts[0] !== 'localhost') {
                    setSubdomain(parts[0]); // Return subdomain part (company-a from company-a.localhost)
                } else {
                    // For development, you can simulate subdomain via URL parameter
                    const urlParams = new URLSearchParams(window.location.search);
                    const tenantParam = urlParams.get('tenant');
                    setSubdomain(tenantParam || 'www');
                }
                setIsLoading(false);
                return;
            }

            // Handle 127.0.0.1 or other IP addresses
            if (hostWithoutPort.includes('127.0.0.1') || /^\d+\.\d+\.\d+\.\d+$/.test(hostWithoutPort)) {
                const urlParams = new URLSearchParams(window.location.search);
                const tenantParam = urlParams.get('tenant');
                setSubdomain(tenantParam || 'www');
                setIsLoading(false);
                return;
            }

            // Production subdomain (e.g., company-a.example.com)
            if (parts.length > 2) {
                setSubdomain(parts[0]);
            } else {
                setSubdomain('www');
            }
            setIsLoading(false);
        };

        extractSubdomain();
    }, []);

    return { subdomain, isLoading };
};