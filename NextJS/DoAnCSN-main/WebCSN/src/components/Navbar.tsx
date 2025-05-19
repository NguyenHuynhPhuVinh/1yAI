'use client';
import { FaRobot } from "react-icons/fa";
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';
import { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const NavbarContent = () => {
    const { isLoading } = useLoading();
    const lineRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDark, setIsDark] = useState(false);
    const [isIntroView, setIsIntroView] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [isInShowAIIntro, setIsInShowAIIntro] = useState(false);
    const [isInAIRanking, setIsInAIRanking] = useState(false);
    const [isInNewAITools, setIsInNewAITools] = useState(false);
    const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
    const [isNavHovered, setIsNavHovered] = useState(false);
    const pathname = usePathname();
    const isSearchPage = pathname.includes('/search');
    const router = useRouter();
    const [hoverText, setHoverText] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const searchParams = useSearchParams();
    const [isAiIcon, setIsAiIcon] = useState(false);
    const isChatPage = pathname === '/chat';
    const shouldShowLines = !isSearchPage && !isChatPage;
    const [aiInputValue, setAiInputValue] = useState('');

    useEffect(() => {
        const aiParam = searchParams.get('ai');
        setIsAiIcon(aiParam === 'true');
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            if (isSearchPage) return;

            const scrollPosition = window.scrollY;
            setHasScrolled(true);

            const threshold = window.innerHeight * 0.8;
            const newIsDark = scrollPosition > threshold;

            if (newIsDark !== isDark) {
                setShouldAnimate(true);
                gsap.killTweensOf([lineRef.current, line1Ref.current, line2Ref.current, line3Ref.current, text1Ref.current, text2Ref.current, inputRef.current]);
            }

            setIsDark(newIsDark);
            setIsIntroView(newIsDark);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDark, isSearchPage]);

    useEffect(() => {
        if (isSearchPage) return;

        const handleScroll = () => {
            const showAIIntroElement = document.querySelector('.showai-intro');
            if (showAIIntroElement) {
                const rect = showAIIntroElement.getBoundingClientRect();
                setIsInShowAIIntro(rect.top <= 0 && rect.bottom >= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSearchPage]);

    useEffect(() => {
        if (isSearchPage) return;

        const handleScroll = () => {
            const aiRankingElement = document.querySelector('#ai-ranking');
            if (aiRankingElement) {
                const rect = aiRankingElement.getBoundingClientRect();
                setIsInAIRanking(rect.top <= 0 && rect.bottom >= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSearchPage]);

    useEffect(() => {
        if (isSearchPage) return;

        const handleScroll = () => {
            const newAIToolsElement = document.querySelector('#new-ai-tools');
            if (newAIToolsElement) {
                const rect = newAIToolsElement.getBoundingClientRect();
                setIsInNewAITools(rect.top <= 0 && rect.bottom >= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSearchPage]);

    gsap.registerPlugin(TextPlugin);

    useEffect(() => {
        if (!isLoading && shouldShowLines) {
            gsap.fromTo(lineRef.current,
                { height: 0 },
                {
                    height: isIntroView ? '0' : '8rem',
                    duration: 1,
                    ease: "power2.out"
                }
            );
        }
    }, [isLoading, isDark, isIntroView, shouldShowLines]);

    useEffect(() => {
        if (!isLoading && shouldAnimate && shouldShowLines) {
            const elements = [line1Ref.current, line2Ref.current, line3Ref.current];
            if (elements.some(el => !el)) return;

            gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
                width: 0
            });

            if (line1Ref.current && text1Ref.current) {
                gsap.fromTo(line1Ref.current,
                    { width: 0 },
                    { width: '4rem', duration: 0.5, delay: 1.5, ease: "power2.out" }
                );

                gsap.fromTo(text1Ref.current,
                    { opacity: 0, x: -50, text: "" },
                    { opacity: 1, x: -150, text: isIntroView ? "Phân tích" : "Xin chào!", duration: 0.5, delay: 2 }
                );
            }

            if (line2Ref.current && text2Ref.current) {
                gsap.fromTo(line2Ref.current,
                    { width: 0 },
                    { width: '4rem', duration: 0.5, delay: 2.7 }
                );

                gsap.fromTo(text2Ref.current,
                    { opacity: 0, x: -70, text: "" },
                    { opacity: 1, x: -300, text: "Mình có thể giúp gì cho bạn?", duration: 0.5, delay: 3.2 }
                );
            }

            if (line3Ref.current && inputRef.current) {
                gsap.fromTo(line3Ref.current,
                    { width: 0 },
                    { width: '4rem', duration: 0.5, delay: 3.9 }
                );

                gsap.fromTo(inputRef.current,
                    { opacity: 0, x: -70 },
                    { opacity: 1, x: -300, duration: 0.5, delay: 4.4 }
                );
            }

            setShouldAnimate(false);
        }
    }, [isLoading, shouldAnimate, isIntroView, shouldShowLines]);

    const scrollToSection = (sectionId: string) => {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!pathname) return;

        const resetAnimation = () => {
            // Reset states
            setIsIntroView(false);
            setIsDark(false);
            setIsNavHovered(false);
            setHoveredTitle(null);
            setShouldAnimate(false);
            setHoverText(false);
            setHasScrolled(false);
            setSearchValue('');

            // Xử lý riêng cho lineRef
            if (lineRef.current) {
                gsap.killTweensOf(lineRef.current);
                gsap.set(lineRef.current, {
                    height: '8rem',  // Set chiều cao mặc định
                    clearProps: "width,opacity,x,y"
                });
            }

            // Xử lý các ref khác
            const otherRefs = [
                line1Ref.current,
                line2Ref.current,
                line3Ref.current,
                text1Ref.current,
                text2Ref.current,
                inputRef.current
            ].filter(ref => ref !== null);

            if (otherRefs.length > 0) {
                gsap.killTweensOf(otherRefs);
                otherRefs.forEach(ref => {
                    if (ref) {
                        gsap.set(ref, { clearProps: "all" });
                    }
                });
            }

            // Delay nhỏ trước khi trigger animation mới
            setTimeout(() => {
                setShouldAnimate(true);
            }, 100);
        };

        // Thực hiện reset
        resetAnimation();

        // Cleanup function
        return () => {
            const allRefs = [
                lineRef.current,
                line1Ref.current,
                line2Ref.current,
                line3Ref.current,
                text1Ref.current,
                text2Ref.current,
                inputRef.current
            ].filter(ref => ref !== null);

            if (allRefs.length > 0) {
                gsap.killTweensOf(allRefs);
            }
        };
    }, [pathname]);

    const handleSearch = () => {
        const trimmedValue = searchValue?.trim();
        if (trimmedValue) {
            // Reset các state
            setIsIntroView(false);
            setIsDark(false);
            setIsNavHovered(false);
            setHoveredTitle(null);
            setShouldAnimate(false);
            setHoverText(false);
            setHasScrolled(false);

            // Cuộn lên đầu trang
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Chuyển hướng đến trang tìm kiếm
            router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        // Thêm một timeout ngắn để đảm bảo animation chạy sau khi component được mount
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Thêm hàm xử lý click vào icon AI
    const handleAIIconClick = () => {
        router.push('/chat');
    };

    // Thêm hàm xử lý khi nhấn Enter trong input AI
    const handleAIInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && aiInputValue.trim()) {
            router.push(`/chat?q=${encodeURIComponent(aiInputValue.trim())}`);
        }
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 h-16 z-50 flex justify-between items-center px-8 transition-colors duration-300 
                ${isAiIcon || isChatPage
                    ? 'bg-black text-white'
                    : isInNewAITools
                        ? 'bg-black'
                        : isDark || isInShowAIIntro
                            ? isInAIRanking
                                ? 'bg-white'
                                : 'bg-black'
                            : 'bg-white'
                }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: isSearchPage || isChatPage ? (isInitialLoad ? 0 : 1) : (isLoading ? 0 : 1),
                y: isSearchPage || isChatPage ? (isInitialLoad ? -20 : 0) : (isLoading ? -20 : 0)
            }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: isSearchPage || isChatPage ? (isInitialLoad ? 0 : 0.2) : (isLoading ? 0 : 0.2)
            }}
            onMouseEnter={() => hasScrolled && setIsNavHovered(true)}
            onMouseLeave={() => {
                setIsNavHovered(false);
                setHoveredTitle(null);
            }}
        >
            <div className={`${beVietnamPro.className} text-xl transition-colors duration-300 
                ${isAiIcon
                    ? 'text-white'
                    : isChatPage
                        ? 'text-white'
                        : isInNewAITools
                            ? 'text-white'
                            : isDark || isInShowAIIntro
                                ? isInAIRanking
                                    ? 'text-black'
                                    : 'text-white'
                                : 'text-black'
                }`}
                onMouseEnter={() => hasScrolled && setHoveredTitle('hover')}
            >
                <AnimatePresence mode="wait">
                    {(hoveredTitle === 'hover' && isNavHovered && !isSearchPage && hasScrolled) ? (
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{
                                duration: 0.3,
                                staggerChildren: 0,
                                ease: "easeInOut"
                            }}
                            key="menu-expanded"
                        >
                            <motion.span
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className={`cursor-pointer px-3 py-1
                                    ${!isIntroView && !isInAIRanking && !isInNewAITools ? 'font-extrabold' : ''}
                                    ${isInNewAITools
                                        ? 'hover:bg-white hover:text-black'
                                        : isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'hover:bg-black hover:text-white'
                                                : 'hover:bg-white hover:text-black'
                                            : 'hover:bg-black hover:text-white'
                                    }`}
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                TRANG CHỦ
                            </motion.span>
                            <motion.span
                                onClick={() => scrollToSection('.showai-intro')}
                                className={`cursor-pointer px-3 py-1
                                    ${isIntroView && !isInAIRanking && !isInNewAITools ? 'font-extrabold' : ''}
                                    ${isInNewAITools
                                        ? 'hover:bg-white hover:text-black'
                                        : isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'hover:bg-black hover:text-white'
                                                : 'hover:bg-white hover:text-black'
                                            : 'hover:bg-black hover:text-white'
                                    }`}
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                PHÂN LOẠI
                            </motion.span>
                            <motion.span
                                onClick={() => scrollToSection('#ai-ranking')}
                                className={`cursor-pointer px-3 py-1
                                    ${isInAIRanking && !isInNewAITools ? 'font-extrabold' : ''}
                                    ${isInNewAITools
                                        ? 'hover:bg-white hover:text-black'
                                        : isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'hover:bg-black hover:text-white'
                                                : 'hover:bg-white hover:text-black'
                                            : 'hover:bg-black hover:text-white'
                                    }`}
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                XẾP HẠNG
                            </motion.span>
                            <motion.span
                                onClick={() => scrollToSection('#new-ai-tools')}
                                className={`cursor-pointer px-3 py-1
                                    ${isInNewAITools ? 'font-extrabold' : ''}
                                    ${isInNewAITools
                                        ? 'hover:bg-white hover:text-black'
                                        : isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'hover:bg-black hover:text-white'
                                                : 'hover:bg-white hover:text-black'
                                            : 'hover:bg-black hover:text-white'
                                    }`}
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                MỚI NHẤT
                            </motion.span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            key="menu-collapsed"
                            className={`cursor-pointer group relative px-3 py-1 ${isSearchPage || isChatPage ? (isAiIcon || isChatPage ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white') : ''}`}
                            onClick={() => {
                                if (isSearchPage || isChatPage) {
                                    router.push('/');
                                }
                            }}
                        >
                            {isSearchPage || isChatPage ? (
                                <div
                                    className={`relative px-3 py-1 
                                        ${isAiIcon || isChatPage
                                            ? 'hover:bg-white hover:text-black'
                                            : 'hover:bg-black hover:text-white'
                                        }`}
                                    onMouseEnter={() => setHoverText(true)}
                                    onMouseLeave={() => setHoverText(false)}
                                >
                                    <span>
                                        {hoverText ? 'QUAY LẠI' : (isSearchPage ? 'TÌM KIẾM' : 'TRÒ CHUYỆN')}
                                    </span>
                                </div>
                            ) : (
                                isInNewAITools
                                    ? 'MỚI NHẤT'
                                    : isInAIRanking
                                        ? 'XẾP HẠNG'
                                        : isIntroView
                                            ? 'PHÂN LOẠI'
                                            : 'TRANG CHỦ'
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isIntroView && !isSearchPage && (
                <div className="fixed left-1/2 -translate-x-1/2" style={{
                    top: '4px',
                    zIndex: 60,
                    transform: `translateX(${(hoveredTitle === 'hover' && isNavHovered) ? '80px' : '-50%'})`,
                    transition: 'transform 0.5s ease-out 0.2s'
                }}>
                    <motion.div
                        className={`h-[3.5em] border-2 overflow-hidden flex items-center transition-colors duration-300 ${isInNewAITools
                            ? 'border-white bg-black'
                            : isInAIRanking
                                ? 'border-black bg-white'
                                : 'border-white bg-black'
                            }`}
                        initial={{ width: '5em' }}
                        animate={{ width: '35em' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className={`w-full px-4 py-1 focus:outline-none text-sm transition-colors duration-300 ${isInNewAITools
                                ? 'bg-black text-white placeholder-text-white'
                                : isInAIRanking
                                    ? 'bg-white text-black placeholder-text-black'
                                    : 'bg-black text-white placeholder-text-white'
                                }`}
                        />
                        <div
                            className="search-icon ml-auto pr-4 cursor-pointer"
                            onClick={handleSearch}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className={`w-6 h-6 transition-colors duration-300 ${isInNewAITools
                                    ? 'text-white'
                                    : isInAIRanking
                                        ? 'text-black'
                                        : 'text-white'
                                    }`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="flex items-center relative">
                <FaRobot
                    className={`w-8 h-8 transition-colors duration-300 cursor-pointer
                        ${isAiIcon
                            ? 'text-white'
                            : isChatPage
                                ? 'text-white'
                                : isInNewAITools
                                    ? 'text-white'
                                    : isDark || isInShowAIIntro
                                        ? isInAIRanking
                                            ? 'text-black'
                                            : 'text-white'
                                        : 'text-black'
                        }`}
                    onClick={handleAIIconClick}
                />
                {shouldShowLines && (
                    <div ref={lineRef} className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 transition-colors duration-300 ${isDark || isInShowAIIntro
                        ? isInAIRanking
                            ? 'bg-black'
                            : 'bg-white'
                        : 'bg-black'
                        }`}>
                        {!isIntroView && (
                            <>
                                <div className="absolute top-8">
                                    <div className="flex items-center">
                                        <div ref={line1Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'bg-black'
                                                : 'bg-white'
                                            : 'bg-black'
                                            }`}></div>
                                        <div ref={text1Ref} className={`absolute left-0 -translate-x-20 border-2 transition-colors duration-300 ${isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'border-black text-black bg-white'
                                                : 'border-white text-white bg-black'
                                            : 'border-black text-black bg-white'
                                            } rounded-lg px-5 py-1.5 whitespace-nowrap`}>
                                            {isIntroView ? "Phân tích" : "Xin chào!"}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-20">
                                    <div className="flex items-center">
                                        <div ref={line2Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'bg-black'
                                                : 'bg-white'
                                            : 'bg-black'
                                            }`}></div>
                                        <div ref={text2Ref} className={`absolute left-0 -translate-x-20 border-2 transition-colors duration-300 ${isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'border-black text-black bg-white'
                                                : 'border-white text-white bg-black'
                                            : 'border-black text-black bg-white'
                                            } rounded-lg px-5 py-1.5 whitespace-nowrap`}>
                                            Mình có thể giúp gì cho bạn?
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-32">
                                    <div className="flex items-center">
                                        <div ref={line3Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark || isInShowAIIntro
                                            ? isInAIRanking
                                                ? 'bg-black'
                                                : 'bg-white'
                                            : 'bg-black'
                                            }`}></div>
                                        <div ref={inputRef} className="absolute left-0 -translate-x-20">
                                            <input
                                                type="text"
                                                value={aiInputValue}
                                                onChange={(e) => setAiInputValue(e.target.value)}
                                                placeholder="Nhập câu hỏi của bạn..."
                                                onKeyPress={handleAIInputKeyPress}
                                                className={`border-2 transition-colors duration-300 ${isDark || isInShowAIIntro
                                                    ? isInAIRanking
                                                        ? 'border-black text-black bg-white placeholder-text-black'
                                                        : 'border-white text-white bg-black placeholder-text-white'
                                                    : 'border-black text-black bg-white placeholder-text-black'
                                                    } rounded-lg px-5 py-1.5 w-72 focus:outline-none`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

const Navbar = () => {
    return (
        <Suspense fallback={null}>
            <NavbarContent />
        </Suspense>
    );
};

export default Navbar; 