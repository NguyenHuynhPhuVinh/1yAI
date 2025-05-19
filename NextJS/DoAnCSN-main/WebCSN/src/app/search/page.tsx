/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro } from 'next/font/google';
import { SelectedToolDetail } from '@/components/SelectedToolDetail';
import anime from 'animejs';
import gsap from 'gsap';
import { FaRobot } from "react-icons/fa";

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

interface Tool {
    id: string;
    name: string;
    image: string;
    description: string[];
    keyFeatures: string[];
    link: string;
    view: number;
    heart: number;
    evaluation: number;
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const router = useRouter();
    const [isGridLayout, setIsGridLayout] = useState(true);
    const [sortBy, setSortBy] = useState<'view' | 'heart' | 'evaluation'>('view');
    const [isAiIcon, setIsAiIcon] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('ai') === 'true';
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedTool(null);
        setIsLoading(true);

        const fetchSearchResults = async () => {
            if (!query) {
                setIsLoading(false);
                setTools([]);
                return;
            }

            try {
                const response = await fetch(isAiIcon ? '/api/showai' : `/api/showai?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                if (isAiIcon) {
                    const aiResponse = await fetch('/api/aiSearch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tools: data.data,
                            query: query
                        }),
                    });

                    if (!aiResponse.ok) {
                        throw new Error('AI search failed');
                    }

                    const aiData = await aiResponse.json();
                    const sortedTools = aiData.data.sort((a: Tool, b: Tool) => b[sortBy] - a[sortBy]);
                    setTools(sortedTools);
                } else {
                    const sortedTools = data.data.sort((a: Tool, b: Tool) => b[sortBy] - a[sortBy]);
                    setTools(sortedTools);
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
                setTools([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, isAiIcon]);

    useEffect(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            searchInput.focus();
        }
    }, []);

    const handleSearch = () => {
        if (!searchValue.trim()) return;

        // Giữ lại trạng thái AI mode trong URL khi tìm kiếm
        const searchQuery = encodeURIComponent(searchValue.trim());
        const aiParam = isAiIcon ? '&ai=true' : '';
        router.push(`/search?q=${searchQuery}${aiParam}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleToolClick = (tool: Tool) => {
        const imageElement = document.querySelector(`[data-tool-id="${tool.id}"]`);
        const targetElement = document.querySelector('#search-selected-tool-container');
        const mainContent = document.querySelector('#search-main-content');

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
        const targetElement = document.querySelector('#search-selected-tool-container');
        const mainContent = document.querySelector('#search-main-content');

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

    const toggleLayout = () => {
        const cards = document.querySelectorAll('[data-tool-id]');

        cards.forEach((card: any) => {
            const imageContainer = card.querySelector('.image-container');
            const contentContainer = card.querySelector('.content-container');
            const description = card.querySelector('.text-gray-600');
            const imageWrapper = card.querySelector('.image-wrapper');

            if (isGridLayout) {
                // Chuyển từ grid sang list
                gsap.to(imageWrapper, {
                    width: '20%', // Giảm xuống 20%
                    duration: 0.5
                });

                gsap.to(imageContainer, {
                    paddingBottom: '65%', // Giảm xuống 65%
                    duration: 0.5
                });

                gsap.to(contentContainer, {
                    width: '80%', // Tăng lên 80%
                    duration: 0.5
                });

                if (description) {
                    gsap.fromTo(description,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.3, delay: 0.3 }
                    );
                }
            } else {
                // Chuyển từ list sang grid
                gsap.to(imageWrapper, {
                    width: '100%',
                    duration: 0.5
                });

                gsap.to(imageContainer, {
                    paddingBottom: '60%',
                    duration: 0.5
                });

                gsap.to(contentContainer, {
                    width: '100%',
                    duration: 0.5
                });

                if (description) {
                    gsap.to(description, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3
                    });
                }
            }
        });

        setTimeout(() => {
            setIsGridLayout(!isGridLayout);
        }, 500);
    };

    const handleSortClick = () => {
        const nextSort = {
            view: 'heart',
            heart: 'evaluation',
            evaluation: 'view'
        } as const;

        const newSortBy = nextSort[sortBy];
        setSortBy(newSortBy);

        const sortedTools = [...tools].sort((a, b) => b[newSortBy] - a[newSortBy]);
        setTools(sortedTools);
    };

    const handleIconClick = () => {
        setIsAiIcon(!isAiIcon);
        const currentParams = new URLSearchParams(window.location.search);
        const currentQuery = currentParams.get('q');

        const newUrl = `/search?q=${currentQuery || ''}&ai=${!isAiIcon}`;
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className={`min-h-screen transition-all duration-300 ease-in-out ${isAiIcon ? 'bg-black' : 'bg-white'} ${beVietnamPro.className}`}>
            <div className={`mx-auto pt-24 w-full max-w-2xl relative transition-colors duration-300 ease-in-out ${isAiIcon ? 'text-white' : 'text-black'}`}>
                <motion.div
                    className={`h-[5em] border-2 transition-all duration-300 ease-in-out ${isAiIcon ? 'border-white bg-black' : 'border-black bg-white'} rounded-full overflow-hidden flex items-center relative mx-auto`}
                    initial={{ width: '5em' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="w-full px-8 flex items-center justify-center">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={query || "Tìm kiếm công cụ AI..."}
                            className={`w-full bg-transparent text-3xl font-medium outline-none transition-colors duration-300 ease-in-out ${isAiIcon ? 'text-white placeholder:text-white' : 'text-black placeholder:text-black'}`}
                            autoFocus
                        />
                        <div
                            className={`search-icon ml-auto cursor-pointer ${isAiIcon ? 'text-white' : 'text-black'}`}
                            onClick={handleSearch}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute pt-24 right-[-16rem] top-1/2 -translate-y-1/2 flex gap-2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded-full 
                            ${isAiIcon
                                ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                            } px-2 py-2`}
                        onClick={handleSortClick}
                    >
                        {sortBy === 'view' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        ) : sortBy === 'heart' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded-full 
                            ${isAiIcon
                                ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                            } px-2 py-2`}
                        onClick={toggleLayout}
                    >
                        {isGridLayout ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded-full 
                            ${isAiIcon
                                ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                            } px-2 py-2`}
                        onClick={handleIconClick}
                    >
                        {isAiIcon ? (
                            <FaRobot className="w-8 h-8" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
                {isLoading ? (
                    <motion.div
                        className={`w-12 h-12 ${isAiIcon ? 'bg-white' : 'bg-black'} mx-auto mt-32`}
                        animate={{
                            rotate: 360,
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ) : (
                    <>
                        <div id="search-selected-tool-container">
                            {selectedTool && (
                                <div className="pl-12">
                                    {tools.map(tool => {
                                        if (tool.id === selectedTool) {
                                            return (
                                                <SelectedToolDetail
                                                    key={tool.id}
                                                    selectedTool={tool}
                                                    onBack={handleBack}
                                                    theme={isAiIcon ? 'dark' : 'light'}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </div>

                        <div id="search-main-content" style={{ display: selectedTool ? 'none' : 'block' }}>
                            <div className={`grid ${isGridLayout ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                                {tools.map((tool, index) => (
                                    <motion.div
                                        key={tool.id}
                                        data-tool-id={tool.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`${isAiIcon ? 'bg-black' : 'bg-white'} rounded-xl overflow-hidden cursor-pointer transform-gpu`}
                                        style={{ display: 'flex', flexDirection: isGridLayout ? 'column' : 'row' }}
                                        onClick={() => handleToolClick(tool)}
                                    >
                                        <div className="image-wrapper transition-all duration-500"
                                            style={{ width: isGridLayout ? '100%' : '20%' }}>
                                            <div className="image-container relative transition-all duration-500"
                                                style={{
                                                    paddingBottom: isGridLayout ? '60%' : '65%',
                                                    position: 'relative'
                                                }}>
                                                <Image
                                                    src={tool.image || '/placeholder.jpg'}
                                                    alt={tool.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </div>
                                        <div className="content-container p-3 transition-all duration-500"
                                            style={{
                                                width: isGridLayout ? '100%' : '80%',
                                                fontSize: isGridLayout ? '1.1rem' : '1.5rem'
                                            }}>
                                            <div className="flex justify-between items-center px-2">
                                                <h2 className={`font-medium ${isAiIcon ? 'text-white' : 'text-black'} ${isGridLayout ? 'text-xl' : 'text-2xl'}`}>
                                                    {tool.name}
                                                </h2>
                                                <div className={`flex items-center gap-2 ${isAiIcon ? 'text-white' : 'text-black'}`}
                                                    style={{ fontSize: isGridLayout ? '1.2rem' : '1.7rem' }}>
                                                    {sortBy === 'view' ? (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                className={`${isGridLayout ? 'h-5 w-5' : 'h-7 w-7'}`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>{tool.view}</span>
                                                        </>
                                                    ) : sortBy === 'heart' ? (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                className={`${isGridLayout ? 'h-5 w-5' : 'h-7 w-7'}`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                            </svg>
                                                            <span>{tool.heart}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                className={`${isGridLayout ? 'h-5 w-5' : 'h-7 w-7'}`}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                            </svg>
                                                            <span>{Number(tool.evaluation).toFixed(1)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {!isGridLayout && (
                                                <p className={`${isAiIcon ? 'text-white' : 'text-black'} mt-2 transition-all duration-300 line-clamp-2 overflow-hidden`}
                                                    style={{
                                                        fontSize: '1.25rem',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                    {tool.description[0]}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {/* No results */}
                            {!isLoading && tools.length === 0 && (
                                <div className="text-center py-16">
                                    <h2 className={`text-2xl font-bold ${isAiIcon ? 'text-white' : 'text-black'} mb-4`}>
                                        Không tìm thấy kết quả nào
                                    </h2>
                                    <p className={isAiIcon ? 'text-white' : 'text-black'}>
                                        Vui lòng thử lại với từ khóa khác
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}