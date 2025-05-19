'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { useRouter } from 'next/navigation';

const MessagesPage = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [idMes, setIdMes] = useState(0);
    const [showAdmin, setShowAdmin] = useState(false);
    const [customTime, setCustomTime] = useState<Date | null>(null);

    useEffect(() => {
        const storedCheckNew = window.sessionStorage.getItem('mes');
        if (storedCheckNew) {
            window.sessionStorage.removeItem('mes');
            window.sessionStorage.removeItem('mesContent');
        }
        setMessageContent(getRandomMessage());
        const storedPhoneNumber = window.localStorage.getItem('phoneNumber');
        if (storedPhoneNumber) {
            setPhoneNumber(storedPhoneNumber);
        }
        const aniOSVersion = window.localStorage.getItem('AniOS');
        if (aniOSVersion && parseFloat(aniOSVersion) >= 1.2) {
            setShowAdmin(true);
        }

        // Load custom time from localStorage
        const savedTime = window.localStorage.getItem('customTime');
        if (savedTime) {
            setCustomTime(new Date(JSON.parse(savedTime)));
        }
    }, []);

    const getRandomMessage = () => {
        const messages = [
            'Cần giải giúp 1 bài toán!',
            'Cần giúp đặt mật khẩu!',
            'Hãy nhập mã captcha giúp tôi!',
            'Hãy giúp tôi giải mã tin nhắn!',
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        if (typeof window !== 'undefined') {
            const storedMessageContent = window.sessionStorage.getItem('mesContent');
            if (storedMessageContent) {
                setIdMes(Number(storedMessageContent));
                return messages[Number(storedMessageContent)];
            }
            else {
                setIdMes(randomIndex);
                window.sessionStorage.setItem('mesContent', randomIndex.toString());
            }
        }
        return messages[randomIndex];
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <h1 className="text-3xl font-[600] mx-2">Tin nhắn</h1>
                </div>
                {phoneNumber ? (
                    <div className="space-y-4">
                        <div
                            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                            onClick={() => router.push(`/AniPhone/mes/view?id=${idMes}`)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Người lạ</span>
                                <span className="text-sm text-gray-400">
                                    {customTime && customTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-gray-300 truncate">{messageContent}</p>
                        </div>
                        {showAdmin && (
                            <div
                                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                onClick={() => router.push('/AniPhone/mes/admin')}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">Admin</span>
                                    <span className="text-sm text-gray-400">
                                        {customTime && customTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-gray-300 truncate">Các mẹo hữu ích!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <p>Bạn chưa đăng ký SIM. Vui lòng đăng ký SIM để sử dụng dịch vụ tin nhắn.</p>
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
                            onClick={() => router.push('/AniPhone/setting/sim')}
                        >
                            Đăng ký SIM
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
