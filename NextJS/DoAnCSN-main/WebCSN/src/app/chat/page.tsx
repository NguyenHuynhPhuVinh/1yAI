'use client';
import { useState, KeyboardEvent, useEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import { useSearchParams } from 'next/navigation';

// Tạo component riêng để xử lý searchParams
function ChatContent() {
    const borderTopRef = useRef(null);
    const borderRightRef = useRef(null);
    const borderBottomRef = useRef(null);
    const borderLeftRef = useRef(null);
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', content: string }>>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tools, setTools] = useState([]);
    const contentRef = useRef(null);
    const searchParams = useSearchParams();
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch tools khi component mount
    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await fetch('/api/showai');
                const data = await response.json();
                setTools(data.data);
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        };
        fetchTools();
    }, []);

    useEffect(() => {
        const tl = gsap.timeline();

        // Ẩn nội dung ban đầu
        gsap.set(contentRef.current, {
            opacity: 0
        });

        // Reset borders với vị trí bắt đầu từ giữa
        gsap.set([borderTopRef.current, borderBottomRef.current], {
            width: 0,
            height: '2px',
            left: '50%',
            xPercent: -50
        });

        gsap.set([borderLeftRef.current, borderRightRef.current], {
            width: '2px',
            height: 0,
            top: '50%',
            yPercent: -50
        });

        // Vẽ tất cả các cạnh cùng lúc
        tl.to([
            borderTopRef.current,
            borderBottomRef.current
        ], {
            width: '100%',
            duration: 0.5,
            ease: 'none'
        })
            .to([
                borderLeftRef.current,
                borderRightRef.current
            ], {
                height: '100%',
                duration: 0.5,
                ease: 'none'
            }, "<")
            .to(contentRef.current, {
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                    const input = document.querySelector('input');
                    if (input) input.focus();
                    setIsAnimationComplete(true);
                }
            });
    }, []);

    useEffect(() => {
        const initialQuestion = searchParams.get('q');

        if (initialQuestion && tools.length > 0 && isAnimationComplete) {
            const askInitialQuestion = async () => {
                setIsLoading(true);
                setMessages(prev => [...prev, { type: 'user', content: initialQuestion }]);

                try {
                    const response = await fetch('/api/aiChat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: initialQuestion,
                            tools: tools
                        })
                    });

                    const data = await response.json();
                    setMessages(prev => [...prev, { type: 'ai', content: data.reply }]);
                } catch (error) {
                    console.error('Chat error:', error);
                    setMessages(prev => [...prev, {
                        type: 'ai',
                        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
                    }]);
                }

                setIsLoading(false);
            };

            askInitialQuestion();
            window.history.replaceState({}, '', '/chat');
        }
    }, [tools, searchParams, isAnimationComplete]);

    const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            setIsLoading(true);
            setMessages(prev => [...prev, { type: 'user', content: input }]);

            try {
                const response = await fetch('/api/aiChat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: input,
                        tools: tools // Truyền tools vào request
                    })
                });

                const data = await response.json();
                setMessages(prev => [...prev, { type: 'ai', content: data.reply }]);
            } catch (error) {
                console.error('Chat error:', error);
                setMessages(prev => [...prev, {
                    type: 'ai',
                    content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
                }]);
            }

            setInput('');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current?.contains(e.target as Node)) {
                const input = document.querySelector('input');
                if (input) input.focus();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="min-h-screen pt-16 bg-black text-white flex items-center justify-center p-4">
            <div ref={containerRef} className="relative w-full h-[calc(100vh-5rem)] max-w-7xl">
                {/* Border container */}
                <div className="absolute inset-0">
                    <div ref={borderTopRef} className="absolute top-0 left-1/2 h-[2px] bg-white" />
                    <div ref={borderRightRef} className="absolute right-0 top-1/2 w-[2px] bg-white" />
                    <div ref={borderBottomRef} className="absolute bottom-0 left-1/2 h-[2px] bg-white" />
                    <div ref={borderLeftRef} className="absolute left-0 top-1/2 w-[2px] bg-white" />
                </div>

                {/* Content container */}
                <div ref={contentRef} className="font-mono bg-black text-white h-full text-xl overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col mb-2">
                            <div className="flex items-start">
                                <span className="text-white whitespace-nowrap">
                                    {msg.type === 'user' ? 'nguoi-dung> ' : 'ai> '}
                                </span>
                                <span className="break-words">{msg.content.split('\n')[0]}</span>
                            </div>
                            {msg.content.split('\n').slice(1).map((line, i) => (
                                <div key={i} className="break-words">
                                    {line}
                                </div>
                            ))}
                        </div>
                    ))}
                    {!isLoading && (
                        <div className="flex">
                            <span className="text-white">nguoi-dung&gt; </span>
                            <input
                                type="text"
                                className="bg-transparent border-none outline-none flex-1 caret-white"
                                autoFocus
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Component chính
export default function ChatPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <ChatContent />
        </Suspense>
    );
}
