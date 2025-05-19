import { useState, useEffect } from 'react';

export function useViewport() {
    const [width, setWidth] = useState<number>(0); // Initial width can be set to 0 or any default value

    useEffect(() => {
        // Check if window is defined to avoid SSR errors
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }

        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setWidth(window.innerWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures useEffect runs only once

    return { width };
}
