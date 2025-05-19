'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter, useSearchParams } from 'next/navigation';
import { IoMdSend } from "react-icons/io";
import PasswordChallengeComponent from '@/components/PasswordChallenge';
import MathChallenge from '@/components/MathChallenge';
import CaptchaChallenge from '@/components/CaptchaChallenge';
import DecodeChallenge from '@/components/DecodeChallenge';

interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: Date;
}

interface Challenge {
    description: string;
}

const MessageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [messages, setMessages] = useState<Message[]>([]);
    const [idMessage, setIdMessage] = useState(0);
    const [money, setMoney] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [, setCurrentChallenge] = useState<Challenge | null>(null);
    const [showPasswordChallenge, setShowPasswordChallenge] = useState(false);
    const [showMathChallenge, setShowMathChallenge] = useState(false);
    const [showCaptchaChallenge, setShowCaptchaChallenge] = useState(false);
    const [showDecodeChallenge, setShowDecodeChallenge] = useState(false);
    const initialChallengeSet = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getCurrentCustomTime = () => {
        const savedTime = window.localStorage.getItem('customTime');
        return savedTime ? new Date(JSON.parse(savedTime)) : new Date();
    };

    useEffect(() => {
        const customTime = getCurrentCustomTime();

        if (id === '0') {
            setMessages([
                { id: 1, sender: 'Người lạ', content: 'Bạn hãy giúp tôi giải quyết bài toán sau: ', timestamp: customTime },
            ]);
            setShowMathChallenge(true);
        } else if (id === '1') {
            setMessages([
                { id: 1, sender: 'Người lạ', content: 'Bạn hãy giúp tôi đặt mật khẩu với điều kiện sau: ', timestamp: customTime },
            ]);
        } else if (id === '2') {
            setMessages([
                { id: 1, sender: 'Người lạ', content: 'Bạn hãy giúp tôi nhập mã CAPTCHA sau: ', timestamp: customTime },
            ]);
            setShowCaptchaChallenge(true);
        } else if (id === '3') {
            setMessages([
                { id: 1, sender: 'Người lạ', content: 'Bạn hãy giúp tôi giải mã tin nhắn sau: ', timestamp: customTime },
            ]);
            setShowDecodeChallenge(true);
        }
        // ... handle other cases if necessary
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[5] === 0) {
            storedAchievementStatuses[5] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Người Lạ');
        }
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const customTime = getCurrentCustomTime();
            const userMessage = { id: messages.length + 1, sender: 'Bạn', content: newMessage, timestamp: customTime };
            setMessages([...messages, userMessage]);
            setNewMessage('');
            // Remove the switch statement here as we're showing the challenge immediately
        }
    };

    const handleChallengeComplete = (reward: number) => {
        setMoney(prevMoney => prevMoney + reward);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('mes', 'true');
            const currentBalance = parseInt(window.localStorage.getItem('balance') || '0', 10);
            window.localStorage.setItem('balance', (currentBalance + reward).toString());
        }
        setIdMessage(idMessage + 1);
        setShowMathChallenge(false);
        setShowPasswordChallenge(false);
        setShowCaptchaChallenge(false);
        setShowDecodeChallenge(false);
    };

    const handleMathMessage = (message: { sender: string; content: string }) => {
        const customTime = getCurrentCustomTime();
        setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, ...message, timestamp: customTime }]);
    };

    const handleMessage = (message: { sender: string; content: string }) => {
        const customTime = getCurrentCustomTime();
        setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, ...message, timestamp: customTime }]);
    };

    const handleInitialChallenge = useCallback((challenge: Challenge) => {
        if (!initialChallengeSet.current) {
            setCurrentChallenge(challenge);

            handleMessage({ sender: 'Người lạ', content: challenge.description });
            initialChallengeSet.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id === '1' && idMessage === 0 && !showPasswordChallenge) {
            setShowPasswordChallenge(true);
            setIdMessage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, idMessage]);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 flex items-center border-b border-gray-700">
                <FaArrowLeftLong className='text-xl cursor-pointer mr-4' onClick={() => router.push('/AniPhone/mes')} />
                <h1 className="text-xl font-semibold">Người lạ</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="h-full overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'Bạn' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'Bạn' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                <p className="break-words">{message.content}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            {money !== 0 ? (
                <div className="p-4 border-t border-gray-700 mb-8 text-center">
                    <p className="text-green-500 font-semibold">Bạn đã nhận được {money.toLocaleString()} đ</p>
                    <p className="text-gray-400 mt-2">Cuộc trò chuyện đã kết thúc</p>
                </div>
            ) : (
                <div className="p-4 border-t border-gray-700 mb-8">
                    {showMathChallenge && (
                        <MathChallenge
                            onChallengeComplete={handleChallengeComplete}
                            onMessage={handleMathMessage}
                        />
                    )}
                    {showPasswordChallenge && (
                        <PasswordChallengeComponent
                            onChallengeComplete={handleChallengeComplete}
                            onMessage={handleMessage}
                            onInitialChallenge={handleInitialChallenge}
                        />
                    )}
                    {showCaptchaChallenge && (
                        <CaptchaChallenge
                            onChallengeComplete={handleChallengeComplete}
                            onMessage={handleMessage}
                        />
                    )}
                    {showDecodeChallenge && (
                        <DecodeChallenge
                            onChallengeComplete={handleChallengeComplete}
                            onMessage={handleMessage}
                        />
                    )}
                    {!showMathChallenge && !showPasswordChallenge && !showCaptchaChallenge && !showDecodeChallenge && (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-grow bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 text-white p-2 rounded-lg ml-2"
                            >
                                <IoMdSend className='text-2xl' />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MessageViewPage = () => {
    return (
        <Suspense>
            <MessageContent />
        </Suspense>
    );
};

export default MessageViewPage;