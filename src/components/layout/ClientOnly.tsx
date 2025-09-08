"use client";

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // Use a timeout to ensure this runs after the component is mounted
        const timer = setTimeout(() => {
            setHasMounted(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
