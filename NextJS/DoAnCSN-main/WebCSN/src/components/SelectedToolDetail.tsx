/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { BackButton } from './BackButton';

interface SelectedToolDetailProps {
    selectedTool: any;
    onBack: () => void;
    theme?: 'dark' | 'light';
}

interface FeatureItemProps {
    feature: string;
    theme?: 'dark' | 'light';
    borderColor: string;
}

const FeatureItem = ({ feature, theme, borderColor }: FeatureItemProps) => {
    const [title, description] = feature.split(':');
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`pl-8 border-b ${borderColor} relative
                ${theme === 'dark'
                    ? isHovered ? 'bg-white text-black border-black' : 'text-white'
                    : isHovered ? 'bg-black text-white border-white' : 'text-black'
                } cursor-pointer`}
            style={{
                margin: '0 -2rem',
                padding: '1rem 2rem 1rem calc(2rem + 2rem)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`absolute left-8 top-1/2 w-6 h-[1px] 
                ${isHovered
                    ? theme === 'dark' ? 'border-black' : 'border-white'
                    : borderColor
                }`}
            />
            <p className="text-lg flex items-start gap-3 w-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 flex-shrink-0 mt-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={isHovered
                            ? "M15.75 19.5L8.25 12l7.5-7.5"
                            : "M8.25 4.5l7.5 7.5-7.5 7.5"
                        }
                    />
                </svg>
                <span className="w-full">
                    {isHovered ? (description || title) : title}
                </span>
            </p>
        </div>
    );
};

export function SelectedToolDetail({
    selectedTool,
    onBack,
    theme = 'light'
}: SelectedToolDetailProps) {
    const textColor = theme === 'dark' ? 'text-white' : 'text-black';
    const borderColor = theme === 'dark' ? 'border-white/20' : 'border-black/20';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start max-w-[800px] mx-auto"
        >
            <div className="w-full">
                <BackButton onClick={onBack} color={theme === 'dark' ? 'white' : 'black'} />
            </div>

            {/* Ảnh */}
            <div className="relative w-full h-[500px] mb-8">
                <Image
                    src={selectedTool.image || '/placeholder.jpg'}
                    alt={selectedTool.name}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Tên và nút truy cập cùng dòng */}
            <div className="w-full flex justify-between items-center mb-12">
                <h3 className={`text-4xl font-bold ${textColor}`}>{selectedTool.name}</h3>
                <span className="relative inline-flex w-[180px] h-[55px] mx-[15px] [perspective:1000px]">
                    <a
                        href={selectedTool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-lg tracking-wider [transform-style:preserve-3d] [transform:translateZ(-25px)] transition-transform duration-300 hover:[transform:translateZ(-25px)_rotateX(-90deg)]`}
                    >
                        <span className={`absolute w-[180px] h-[55px] flex items-center justify-center gap-2 border-[2px] ${theme === 'dark' ? 'border-white text-white' : 'border-black text-black'} bg-transparent rounded-[5px] [transform:rotateY(0deg)_translateZ(25px)] text-lg font-medium`}>
                            <span>Truy cập</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </span>
                        <span className={`absolute w-[180px] h-[55px] flex items-center justify-center gap-2 border-[2px] ${theme === 'dark' ? 'border-white bg-white text-black' : 'border-black bg-black text-white'} rounded-[5px] [transform:rotateX(90deg)_translateZ(25px)] text-lg font-medium`}>
                            <span>Truy cập</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </span>
                    </a>
                </span>
            </div>

            {/* Mô tả */}
            <div className="w-full mb-16">
                <div className="space-y-6">
                    {selectedTool.description?.map((desc: string, index: number) => (
                        <p key={index} className={`${textColor} text-lg leading-relaxed`}>
                            {desc}
                        </p>
                    ))}
                </div>
            </div>

            {/* Tính năng chính */}
            <div className="w-full">
                <h4 className={`text-2xl font-medium ${textColor} mb-6 border-b ${borderColor} pb-4`}>
                    Tính năng chính
                </h4>
                <div className="grid grid-cols-1 gap-0 ml-8 relative">
                    <div
                        className={`absolute left-0 w-[1px] transition-colors duration-300 ${borderColor} group-hover:border-black dark:group-hover:border-white`}
                        style={{
                            top: '-24px',
                            height: 'calc(100% + 24px)'
                        }}
                    />
                    {selectedTool.keyFeatures?.map((feature: string, index: number) => (
                        <FeatureItem
                            key={index}
                            feature={feature}
                            theme={theme}
                            borderColor={borderColor}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 