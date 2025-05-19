'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaTrash } from "react-icons/fa";

interface Message {
    title: string;
    content: string;
    hasReward: boolean;
    rewardPoints: number;
}

const InboxPage = () => {
    const router = useRouter();
    const [messageStatuses, setMessageStatuses] = useState<number[]>([]);
    const [currentPoints, setCurrentPoints] = useState(0);

    const messages: Message[] = [
        {
            title: "Chào mừng đến với AniPhone",
            content: "Cảm ơn bạn đã tham gia trò chơi. Chúc bạn có những trải nghiệm thú vị!",
            hasReward: true,
            rewardPoints: 1000,
        },
        // Thêm các tin nhắn khác vào đây nếu cần
    ];

    useEffect(() => {
        const storedStatuses = JSON.parse(localStorage.getItem('inboxMessageStatuses') || '[]');
        setMessageStatuses(storedStatuses);

        const updatePoints = () => {
            const points = parseInt(localStorage.getItem('point') || '0');
            setCurrentPoints(points);
        };

        updatePoints();
        const intervalId = setInterval(updatePoints, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const deleteMessage = (index: number) => {
        const updatedStatuses = [...messageStatuses];
        updatedStatuses[index] = -1; // Đánh dấu tin nhắn đã bị xóa
        setMessageStatuses(updatedStatuses);
        localStorage.setItem('inboxMessageStatuses', JSON.stringify(updatedStatuses));
    };

    const claimReward = (index: number) => {
        const updatedStatuses = [...messageStatuses];
        updatedStatuses[index] = 1; // Đánh dấu phần thưởng đã được nhận
        setMessageStatuses(updatedStatuses);
        localStorage.setItem('inboxMessageStatuses', JSON.stringify(updatedStatuses));

        // Cộng điểm thưởng
        const rewardPoints = messages[index].rewardPoints;
        const newPoints = currentPoints + rewardPoints;
        setCurrentPoints(newPoints);
        localStorage.setItem('point', newPoints.toString());
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting/user-center')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Hòm thư</h1>
                </div>
                <div className="space-y-4">
                    {messages.some((_, index) => messageStatuses[index] !== -1) ? (
                        messages.map((message, index) => (
                            messageStatuses[index] !== -1 && (
                                <div key={index} className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaEnvelope className="text-lg" />
                                            <span className="text-lg flex-grow">{message.title}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3">
                                            {message.content}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            {message.hasReward && messageStatuses[index] === 0 && (
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex-grow mr-2"
                                                    onClick={() => claimReward(index)}
                                                >
                                                    Nhận thưởng {message.rewardPoints} điểm
                                                </button>
                                            )}
                                            {message.hasReward && messageStatuses[index] === 1 && (
                                                <p className="text-green-500 flex-grow mr-2">
                                                    Đã nhận thưởng
                                                </p>
                                            )}
                                            <FaTrash
                                                className="text-lg cursor-pointer text-red-500"
                                                onClick={() => deleteMessage(index)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <div className="text-center text-gray-500 p-4">
                            Không có tin nhắn nào trong hòm thư.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
