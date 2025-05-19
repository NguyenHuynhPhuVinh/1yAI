'use client'

import { useState, useEffect, useCallback } from 'react';
import { FaCoins, FaUser, FaBook, FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';

const DocTruyenKiemTien = () => {
    const [balance, setBalance] = useState(0);
    const [stories, setStories] = useState([
        { "id": 1, "title": "Cuộc phiêu lưu kỳ thú", "chapters": 10, "reward": 5 },
        { "id": 2, "title": "Bí mật của rừng xanh", "chapters": 15, "reward": 8 },
        { "id": 3, "title": "Hành trình về phương Đông", "chapters": 20, "reward": 10 },
        { "id": 4, "title": "Công chúa chiến binh", "chapters": 12, "reward": 6 },
        { "id": 5, "title": "Thợ săn quái vật", "chapters": 18, "reward": 9 },
        { "id": 6, "title": "Thành phố trên mây", "chapters": 22, "reward": 11 },
        { "id": 7, "title": "Vùng đất của ma thuật", "chapters": 16, "reward": 7 },
        { "id": 8, "title": "Thế giới song song", "chapters": 14, "reward": 6 },
        { "id": 9, "title": "Lời thề của kiếm sĩ", "chapters": 25, "reward": 12 },
        { "id": 10, "title": "Đại chiến thần thú", "chapters": 30, "reward": 15 },
    ]);
    const [currentStory, setCurrentStory] = useState<{
        id: number;
        title: string;
        chapters: number;
        reward: number;
    } | null>(null);
    const [currentChapter, setCurrentChapter] = useState(1);
    const [showExchange, setShowExchange] = useState(false);
    const [, setCustomTime] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTime = window.localStorage.getItem('customTime');
            return savedTime ? new Date(JSON.parse(savedTime)) : new Date();
        }
        return new Date();
    });

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceStory');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[12] === 0) {
            storedAchievementStatuses[12] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web 1');
        }
        // Mở khóa công việc 5
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[4] === -1) {
            storedJobs[4] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    const updateCustomTime = useCallback((minutes: number) => {
        setCustomTime(prevTime => {
            const newTime = new Date(prevTime.getTime() + minutes * 60000);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('customTime', JSON.stringify(newTime));
            }
            return newTime;
        });
    }, []);

    const readChapter = () => {
        if (currentStory && currentChapter <= currentStory.chapters && typeof window !== 'undefined') {
            const newBalance = balance + currentStory.reward;
            setBalance(newBalance);
            window.localStorage.setItem('balanceStory', newBalance.toString());

            const newChapter = currentChapter + 1;
            setCurrentChapter(newChapter);

            // Lưu số chapter đã đọc vào sessionStorage
            window.sessionStorage.setItem(`story_${currentStory.id}`, newChapter.toString());

            // Cập nhật thời gian tùy chỉnh
            updateCustomTime(currentStory.reward * 2); // Tăng 2 phút cho mỗi xu nhận được

            // Nếu đã đọc hết truyện, xóa id story khỏi sessionStorage
            if (newChapter > currentStory.chapters) {
                window.sessionStorage.removeItem(`story_${currentStory.id}`);
            }
        }
    };

    useEffect(() => {
        if (currentStory && currentChapter > currentStory.chapters) {
            setStories(prevStories => prevStories.filter(story => story.id !== currentStory.id));
            setCurrentStory(null);
            setCurrentChapter(1);
        }
    }, [currentChapter, currentStory]);

    const selectStory = (story: { id: number; title: string; chapters: number; reward: number }) => {
        if (typeof window !== 'undefined') {
            setCurrentStory(story);
            const savedChapter = window.sessionStorage.getItem(`story_${story.id}`);
            setCurrentChapter(savedChapter ? parseInt(savedChapter) : 1);
        }
    };

    const toggleExchange = () => {
        setShowExchange(!showExchange);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 text-gray-800 p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Đọc Truyện Kiếm Tiền</h1>

            <div className="bg-white rounded-lg shadow-lg p-3 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <FaUser className="text-indigo-500 mr-2 text-lg" />
                    <span className="font-semibold text-sm">Người dùng</span>
                </div>
                <div
                    className="flex items-center bg-yellow-100 px-3 py-1 rounded-full cursor-pointer"
                    onClick={toggleExchange}
                >
                    <FaCoins className="text-yellow-500 mr-2 text-lg" />
                    <span className="font-bold text-base">{balance} xu</span>
                </div>
            </div>

            {showExchange && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-indigo-700">Đổi xu lấy tiền</h2>
                    <p className="mb-2">Số xu hiện tại: <span className="font-bold">{balance}</span></p>
                    <p className="mb-4">Tỉ lệ đổi: 100 xu = 1000 đồng</p>
                    {balance >= 100 && (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
                            onClick={() => {
                                const exchangeAmount = Math.floor(balance / 100) * 1000;
                                const newBalance = balance - Math.floor(balance / 100) * 100;
                                setBalance(newBalance);
                                if (typeof window !== 'undefined') {
                                    const currentBalance = parseInt(window.localStorage.getItem('balance') || '0');
                                    const updatedBalance = currentBalance + exchangeAmount;
                                    window.localStorage.setItem('balance', updatedBalance.toString());

                                    const updatedBalanceStory = newBalance;
                                    window.localStorage.setItem('balanceStory', updatedBalanceStory.toString());
                                }

                                // Show notification
                                if (typeof window !== 'undefined') {
                                    window.sessionStorage.setItem('Notification', `Bạn đã nhận được ${exchangeAmount.toLocaleString()} đồng`);
                                }
                            }}
                        >
                            <FaExchangeAlt className="mr-2" />
                            Đổi xu
                        </button>
                    )}
                </div>
            )}

            {!currentStory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.length > 0 ? (
                        stories.map(story => (
                            <div key={story.id} className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:bg-indigo-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" onClick={() => selectStory(story)}>
                                <h2 className="text-lg font-semibold mb-2 text-indigo-600">{story.title}</h2>
                                <p className="text-gray-600 mb-2 flex items-center text-sm">
                                    <FaBook className="mr-2 text-indigo-400" />
                                    Số chương: {story.chapters}
                                </p>
                                <p className="text-green-600 font-semibold flex items-center text-sm">
                                    <FaCoins className="mr-2 text-yellow-500" />
                                    Thưởng: {story.reward} xu/chương
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Không còn truyện nào để đọc!</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                                onClick={() => {
                                    setStories([
                                        { "id": 1, "title": "Cuộc phiêu lưu kỳ thú", "chapters": 10, "reward": 5 },
                                        { "id": 2, "title": "Bí mật của rừng xanh", "chapters": 15, "reward": 8 },
                                        { "id": 3, "title": "Hành trình về phương Đông", "chapters": 20, "reward": 10 },
                                        { "id": 4, "title": "Công chúa chiến binh", "chapters": 12, "reward": 6 },
                                        { "id": 5, "title": "Thợ săn quái vật", "chapters": 18, "reward": 9 },
                                        { "id": 6, "title": "Thành phố trên mây", "chapters": 22, "reward": 11 },
                                        { "id": 7, "title": "Vùng đất của ma thuật", "chapters": 16, "reward": 7 },
                                        { "id": 8, "title": "Thế giới song song", "chapters": 14, "reward": 6 },
                                        { "id": 9, "title": "Lời thề của kiếm sĩ", "chapters": 25, "reward": 12 },
                                        { "id": 10, "title": "Đại chiến thần thú", "chapters": 30, "reward": 15 },
                                    ]);
                                }}
                            >
                                Làm mới
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h2 className="text-2xl font-semibold mb-3 text-indigo-700">{currentStory.title}</h2>
                    <div className="mb-4 bg-indigo-100 p-3 rounded-lg">
                        <p className="text-base">Chương hiện tại: <span className="font-bold text-indigo-600">{currentChapter - 1}/{currentStory.chapters}</span></p>
                        <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${((currentChapter - 1) / currentStory.chapters) * 100}%` }}></div>
                        </div>
                    </div>
                    {currentChapter <= currentStory.chapters ? (
                        <button
                            className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md text-sm"
                            onClick={readChapter}
                        >
                            Đọc chương tiếp theo
                        </button>
                    ) : (
                        <p className="text-green-600 font-semibold text-base">Bạn đã đọc hết truyện này!</p>
                    )}
                    <button
                        className="mt-4 text-indigo-500 hover:text-indigo-700 flex items-center text-sm"
                        onClick={() => {
                            setCurrentStory(null);
                            setCurrentChapter(1);
                        }}
                    >
                        <FaArrowLeft className="mr-2" />
                        Quay lại danh sách truyện
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocTruyenKiemTien;
