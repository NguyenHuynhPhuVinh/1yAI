import React, { useEffect, useRef, ReactNode } from 'react';

interface AutoScrollDivProps {
    children: ReactNode;
}

const AutoScrollDiv: React.FC<AutoScrollDivProps> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [children]);

    return (
        <div
            ref={scrollRef}
            className="h-64 overflow-auto border border-gray-300 p-4"
        >
            {children}
        </div>
    );
};

export default AutoScrollDiv;
