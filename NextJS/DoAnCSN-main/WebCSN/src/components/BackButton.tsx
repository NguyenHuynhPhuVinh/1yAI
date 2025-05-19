import { motion } from 'framer-motion';

interface BackButtonProps {
    onClick: () => void;
    color?: 'white' | 'black';
}

export function BackButton({ onClick, color = 'white' }: BackButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`flex items-center gap-2 text-${color} hover:text-${color} transition-colors mb-4`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={color}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
            </svg>
            <span className="text-lg font-medium">Quay lại</span>
        </motion.button>
    );
} 