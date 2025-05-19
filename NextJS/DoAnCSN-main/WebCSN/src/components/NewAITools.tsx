'use client';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import Footer from './Footer';
import { SelectedToolDetail } from './SelectedToolDetail';
import anime from 'animejs';
import gsap from 'gsap';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

interface Tool {
    id: string;
    name: string;
    image: string;
    description: string;
    createdAt: string;
    link: string;
}

export default function NewAITools() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, {
        amount: 0.2,
        once: true
    });

    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

    const indexOfLastTool = currentPage * limit;
    const indexOfFirstTool = indexOfLastTool - limit;
    const currentTools = allTools.slice(indexOfFirstTool, indexOfLastTool);
    const totalPages = Math.ceil(allTools.length / limit);

    const gridRef = useRef(null);

    useEffect(() => {
        fetch('/api/showai')
            .then(res => res.json())
            .then(data => {
                console.log('NewAITools data:', data);
                if (Array.isArray(data.data)) {
                    setAllTools(data.data);
                }
            })
            .catch(err => console.error('Lỗi khi tải dữ liệu công cụ AI mới:', err));
    }, []);

    const getRandomDelay = () => Math.random() * 0.5;

    useEffect(() => {
        console.log('isInView:', isInView);

        if (isInView) {
            gsap.timeline()
                .to(".ai-tools-heading", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.2
                })
                .to(".ai-tools-description", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.5");

            anime({
                targets: '.tool-item',
                scale: [0.5, 1],
                opacity: [0, 1],
                delay: () => getRandomDelay() * 1000,
                duration: 800,
                easing: 'easeOutElastic(1, .5)',
                begin: () => {
                    console.log('Grid animation started');
                }
            });
        }
    }, [isInView]);

    const handleToolClick = (tool: Tool) => {
        const targetElement = document.querySelector('#new-tools-selected-container');
        const mainContent = document.querySelector('#new-tools-main-content');

        if (targetElement && mainContent) {
            // Animation ẩn main content
            anime({
                targets: mainContent,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(tool);
                    window.scrollTo({
                        top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
                        behavior: 'smooth'
                    });
                    // Animation hiện chi tiết
                    anime({
                        targets: targetElement,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 500,
                        easing: 'easeOutExpo'
                    });
                }
            });
        }
    };

    const handleBack = () => {
        const targetElement = document.querySelector('#new-tools-selected-container');
        const mainContent = document.querySelector('#new-tools-main-content');

        if (targetElement && mainContent) {
            // Animation ẩn chi tiết
            anime({
                targets: targetElement,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(null);
                    setTimeout(() => {
                        // Animation hiện main content
                        anime({
                            targets: mainContent,
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 500,
                            easing: 'easeOutExpo'
                        });
                    }, 100);
                }
            });
        }
    };

    const nextSlide = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevSlide = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (direction: 'next' | 'prev') => {
        const targets = document.querySelectorAll('.tool-item');

        anime({
            targets: targets,
            scale: [1, 0.5],
            opacity: [1, 0],
            delay: () => getRandomDelay() * 300,
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                if (direction === 'next') {
                    nextSlide();
                } else {
                    prevSlide();
                }

                anime({
                    targets: '.tool-item',
                    scale: [0.5, 1],
                    opacity: [0, 1],
                    delay: () => getRandomDelay() * 500,
                    duration: 600,
                    easing: 'easeOutElastic(1, .5)',
                    begin: () => {
                        console.log('New items animation started');
                    }
                });
            }
        });
    };

    return (
        <div
            id="new-ai-tools"
            className={`bg-black text-white pt-32 ${beVietnamPro.className} overflow-hidden`}
            ref={containerRef}
        >
            <div className="container mx-auto px-8 md:px-16 max-w-7xl">
                <div className="text-center mb-24">
                    <div
                        className="ai-tools-heading"
                        style={{
                            opacity: 0,
                            transform: 'translateY(100px)'
                        }}
                    >
                        <h2 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider`}>
                            Công Cụ AI Mới Nhất
                        </h2>
                    </div>

                    <div
                        className="ai-tools-description"
                        style={{
                            opacity: 0,
                            transform: 'translateY(50px)'
                        }}
                    >
                        <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed font-medium">
                            Khám phá những công cụ AI mới nhất được cập nhật liên tục,
                            giúp bạn luôn đi đầu với xu hướng công nghệ.
                        </p>
                    </div>
                </div>

                <div id="new-tools-selected-container">
                    {selectedTool && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SelectedToolDetail
                                selectedTool={selectedTool}
                                onBack={handleBack}
                                theme="dark"
                            />
                        </motion.div>
                    )}
                </div>

                <div id="new-tools-main-content"
                    style={{
                        display: selectedTool ? 'none' : 'block',
                        minHeight: '600px'
                    }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6" ref={gridRef}>
                        {currentTools.map((tool) => (
                            <motion.div
                                key={tool.id}
                                className="tool-item border-2 border-white p-4 cursor-pointer group relative"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: getRandomDelay(),
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className="group-hover:opacity-0">
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src={tool.image}
                                            alt={tool.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white text-center mt-4">
                                        {tool.name}
                                    </h3>
                                </div>

                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToolClick(tool);
                                        }}
                                        className="w-32 px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white"
                                    >
                                        Chi tiết
                                    </button>
                                    <a
                                        href={tool.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-32 px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Truy cập
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12 mb-24 gap-20">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer 
                            hover:bg-white group border-2 border-white
                            ${currentPage === 1 ? 'opacity-50' : ''}`}
                            onClick={() => currentPage !== 1 && handlePageChange('prev')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8 text-white group-hover:text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer 
                            hover:bg-white group border-2 border-white
                            ${currentPage === totalPages ? 'opacity-50' : ''}`}
                            onClick={() => currentPage !== totalPages && handlePageChange('next')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8 text-white group-hover:text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
} 