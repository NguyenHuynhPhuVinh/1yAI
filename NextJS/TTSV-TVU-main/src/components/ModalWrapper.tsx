import React, { ReactNode } from 'react';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'; // Tailwind max-width classes
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md', // Default max-width
}) => {
    if (!isOpen) return null;

    const maxWidthClasses: { [key: string]: string } = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm"
            onClick={onClose} // Close on overlay click
        >
            <div
                // Removed dark:bg-gray-800
                className={`bg-white rounded-lg shadow-xl p-6 m-4 w-full ${maxWidthClasses[maxWidth]} overflow-y-auto max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Modal Header - Adjusted spacing and font */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5"> {/* Adjusted pb, mb */}
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3> {/* Increased font size */}
                    <button
                        onClick={onClose}
                        // Adjusted padding
                        className="p-1.5 rounded text-gray-400 hover:text-[var(--vibrant-blue)] hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--vibrant-blue)]"
                        aria-label="Đóng modal"
                    >
                        {/* Simple X icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalWrapper;
