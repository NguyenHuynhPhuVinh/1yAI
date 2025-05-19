'use client';
import { useEffect, useState, useRef } from 'react';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { SelectedToolDetail } from './SelectedToolDetail';
import anime from 'animejs';
import NewAITools from './NewAITools';

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
    view: number;
    heart: number;
    evaluation: number;
    description: string;
}

export default function AIRanking() {
    const [viewTools, setViewTools] = useState<Tool[]>([]);
    const [heartTools, setHeartTools] = useState<Tool[]>([]);
    const [evaluationTools, setEvaluationTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    // Refs cho từng phần
    const titleRef = useRef(null);

    // useInView cho từng phần
    const isTitleInView = useInView(titleRef, {
        once: true,
        amount: 0.5
    });

    const lineVariants = {
        hidden: { width: 0 },
        visible: {
            width: "100%",
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [viewResponse, heartResponse, evaluationResponse] = await Promise.all([
                    fetch('/api/showai?sort=view&limit=9'),
                    fetch('/api/showai?sort=heart&limit=9'),
                    fetch('/api/showai?sort=evaluation&limit=9')
                ]);

                const viewData = await viewResponse.json();
                const heartData = await heartResponse.json();
                const evaluationData = await evaluationResponse.json();

                setViewTools(viewData.data);
                setHeartTools(heartData.data);
                setEvaluationTools(evaluationData.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const columnConfig = [
        {
            tools: viewTools,
            title: "Lượt xem cao nhất",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            tools: heartTools,
            title: "Yêu thích nhiều nhất",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            tools: evaluationTools,
            title: "Đánh giá cao nhất",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        }
    ];

    const handleToolClick = (tool: Tool) => {
        const imageElement = document.querySelector(`[data-tool-id="${tool.id}"]`);
        const targetElement = document.querySelector('#ai-ranking-selected-tool-container');
        const mainContent = document.querySelector('#ai-ranking-main-content');

        if (imageElement && targetElement && mainContent) {
            anime({
                targets: mainContent,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(tool.id);
                    window.scrollTo({
                        top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
                        behavior: 'smooth'
                    });
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
        const targetElement = document.querySelector('#ai-ranking-selected-tool-container');
        const mainContent = document.querySelector('#ai-ranking-main-content');

        if (targetElement && mainContent) {
            anime({
                targets: targetElement,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(null);
                    setTimeout(() => {
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

    return (
        <motion.div
            id="ai-ranking"
            className={`min-h-screen bg-white text-black ${beVietnamPro.className} mt-12`}
        >
            <div className="h-full py-24 px-8">
                {/* Title section */}
                <motion.div
                    ref={titleRef}
                    className="text-center mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider text-black`}>
                        Top Những Công Cụ AI
                    </h1>
                    <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
                        Tổng hợp những công cụ AI hàng đầu được cộng đồng sử dụng nhiều nhất,
                        giúp bạn nâng cao hiệu suất công việc trong từng lĩnh vực.
                    </p>
                </motion.div>

                {
                    !isLoading && (
                        <motion.div className="relative max-w-7xl mx-auto">
                            <div id="ai-ranking-selected-tool-container">
                                {selectedTool && (
                                    <div className="pl-12">
                                        {columnConfig.map(column => {
                                            const tool = column.tools.find(t => t.id === selectedTool);
                                            if (!tool) return null;
                                            return (
                                                <SelectedToolDetail
                                                    key={tool.id}
                                                    selectedTool={tool}
                                                    onBack={handleBack}
                                                    theme="light"
                                                />
                                            );
                                        }).filter(Boolean)[0]}
                                    </div>
                                )}
                            </div>

                            <div id="ai-ranking-main-content" style={{ display: selectedTool ? 'none' : 'block' }}>
                                {/* Số thứ tự và đường kẻ ngang */}
                                <div
                                    className="absolute left-[-30px] top-[65px] w-12"
                                    style={{ display: selectedTool ? 'none' : 'block' }}
                                >
                                    {[...Array(9)].map((_, index) => (
                                        <div key={index} className={`${orbitron.className} text-xl font-bold h-[120px] relative`}>
                                            <motion.div
                                                className="absolute left-[-20px] right-[-20px] top-1/2 border-b-2 border-gray-200 -z-10"
                                                variants={lineVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, amount: 0.3 }}
                                            />
                                            <motion.span
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                #{index + 1}
                                            </motion.span>
                                        </div>
                                    ))}
                                </div>

                                {/* Grid chính */}
                                <div className="grid grid-cols-3 gap-8 pl-12 divide-x-2 divide-black">
                                    {columnConfig.map((column, colIndex) => (
                                        <div key={colIndex} className={`flex flex-col ${colIndex > 0 ? 'pl-8' : ''}`}>
                                            <motion.h2
                                                className="text-2xl font-bold flex items-center justify-center text-center mb-6 pb-2 border-b-2 border-black"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "100%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8 }}
                                            >
                                                {column.icon}
                                                {column.title}
                                            </motion.h2>
                                            {column.tools.map((tool, index) => (
                                                <motion.div
                                                    key={tool.id}
                                                    data-tool-id={tool.id}
                                                    className="flex items-center gap-4 h-[120px] border-b-2 border-black -mx-8 px-8 group relative hover:bg-black"
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true, amount: 0.3 }}
                                                    custom={index}
                                                >
                                                    <div className="flex items-center gap-4 w-full">
                                                        <div className="relative w-20 h-20">
                                                            <Image
                                                                src={tool.image || '/placeholder.jpg'}
                                                                alt={tool.name}
                                                                fill
                                                                className="object-cover rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="font-bold group-hover:text-white">
                                                            {tool.name}
                                                        </div>
                                                        <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-4">
                                                            <button
                                                                onClick={() => handleToolClick(tool)}
                                                                className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black"
                                                            >
                                                                Chi tiết
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div >
            {!selectedTool && <NewAITools />}
        </motion.div >
    );
} 