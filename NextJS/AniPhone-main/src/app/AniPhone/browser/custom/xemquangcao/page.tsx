'use client'

import { useState, useEffect } from 'react';
import { FaCoins, FaPlay, FaRedoAlt, FaExchangeAlt, FaTimes, FaClock, FaAd } from 'react-icons/fa';

interface Ad {
    id: number;
    title: string;
    reward: number;
    duration: number;
}

const XemQuangCaoKiemTien = () => {
    const [balance, setBalance] = useState(0);
    const [ads, setAds] = useState<Ad[]>([
        { id: 1, title: 'Quảng cáo sản phẩm làm đẹp', reward: 5, duration: 15 },
        { id: 2, title: 'Quảng cáo ứng dụng di động', reward: 8, duration: 20 },
        { id: 3, title: 'Quảng cáo dịch vụ du lịch', reward: 10, duration: 25 },
        { id: 4, title: 'Quảng cáo thực phẩm chức năng', reward: 7, duration: 18 },
        { id: 5, title: 'Quảng cáo game mobile mới', reward: 6, duration: 16 },
        { id: 6, title: 'Quảng cáo dịch vụ giao hàng', reward: 9, duration: 22 },
        { id: 7, title: 'Quảng cáo khóa học trực tuyến', reward: 11, duration: 28 },
        { id: 8, title: 'Quảng cáo thiết bị công nghệ', reward: 12, duration: 30 },
        { id: 9, title: 'Quảng cáo dịch vụ tài chính', reward: 8, duration: 20 },
        { id: 10, title: 'Quảng cáo sự kiện âm nhạc', reward: 7, duration: 18 },
    ]);
    const [currentAd, setCurrentAd] = useState<Ad | null>(null);
    const [isWatching, setIsWatching] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showExchange, setShowExchange] = useState(false);

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceAd');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[14] === 0) {
            storedAchievementStatuses[14] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web 3');
        }
        // Mở khóa công việc 7
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[6] === -1) {
            storedJobs[6] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isWatching && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (isWatching && timeLeft === 0) {
            completeAd();
        }
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWatching, timeLeft]);

    const startWatchingAd = (ad: Ad) => {
        setCurrentAd(ad);
        setIsWatching(true);
        setTimeLeft(ad.duration);
    };

    const completeAd = () => {
        if (currentAd) {
            const newBalance = balance + currentAd.reward;
            setBalance(newBalance);
            window.localStorage.setItem('balanceAd', newBalance.toString());
            setIsWatching(false);
            setCurrentAd(null);
            setAds(ads.filter(ad => ad.id !== currentAd.id));
        }
    };

    const refreshAds = () => {
        setAds([
            { id: 1, title: 'Quảng cáo sản phẩm làm đẹp', reward: 5, duration: 15 },
            { id: 2, title: 'Quảng cáo ứng dụng di động', reward: 8, duration: 20 },
            { id: 3, title: 'Quảng cáo dịch vụ du lịch', reward: 10, duration: 25 },
            { id: 4, title: 'Quảng cáo thực phẩm chức năng', reward: 7, duration: 18 },
            { id: 5, title: 'Quảng cáo game mobile mới', reward: 6, duration: 16 },
            { id: 6, title: 'Quảng cáo dịch vụ giao hàng', reward: 9, duration: 22 },
            { id: 7, title: 'Quảng cáo khóa học trực tuyến', reward: 11, duration: 28 },
            { id: 8, title: 'Quảng cáo thiết bị công nghệ', reward: 12, duration: 30 },
            { id: 9, title: 'Quảng cáo dịch vụ tài chính', reward: 8, duration: 20 },
            { id: 10, title: 'Quảng cáo sự kiện âm nhạc', reward: 7, duration: 18 },
        ]);
    };

    const exchangeCoins = () => {
        if (typeof window !== 'undefined') {
            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance - Math.floor(balance / 10) * 10;
            setBalance(newBalance);
            const currentBalance = parseInt(window.localStorage.getItem('balance') || '0', 10);
            const updatedBalance = currentBalance + exchangeAmount;
            window.localStorage.setItem('balance', updatedBalance.toString());
            window.localStorage.setItem('balanceAd', newBalance.toString());

            // Show notification
            window.sessionStorage.setItem('Notification', `Bạn đã nhận được ${exchangeAmount.toLocaleString()} đồng`);

            setShowExchange(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-2">
            <h1 className="text-2xl font-bold mb-4 text-center text-yellow-300 tracking-wide">Xem Quảng Cáo Kiếm Tiền</h1>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-3 mb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <FaAd className="text-yellow-300 mr-1 text-lg" />
                        <span className="font-semibold text-sm">Xem quảng cáo</span>
                    </div>
                    <div
                        className="flex items-center bg-yellow-400 px-3 py-1 rounded-full cursor-pointer hover:bg-yellow-300 transition-colors duration-300"
                        onClick={() => setShowExchange(!showExchange)}
                    >
                        <FaCoins className="text-purple-800 mr-1 text-sm" />
                        <span className="font-bold text-sm text-purple-800">{balance} xu</span>
                    </div>
                </div>
            </div>

            {showExchange && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-md p-4 m-2 max-w-xs w-full relative">
                        <h2 className="text-xl font-semibold mb-3 text-purple-800">Đổi xu lấy tiền</h2>
                        <button
                            onClick={() => setShowExchange(false)}
                            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                        <p className="mb-2 text-sm text-gray-700">Số xu hiện tại: <span className="font-bold text-purple-600">{balance}</span></p>
                        <p className="mb-3 text-sm text-gray-700">Tỉ lệ đổi: 10 xu = 1000 đồng</p>
                        {balance >= 10 ? (
                            <button
                                onClick={exchangeCoins}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 flex items-center justify-center w-full text-sm"
                            >
                                <FaExchangeAlt className="mr-1" /> Đổi xu
                            </button>
                        ) : (
                            <p className="text-red-500 text-xs">Bạn cần ít nhất 10 xu để đổi.</p>
                        )}
                    </div>
                </div>
            )}

            {isWatching ? (
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-300">{currentAd?.title}</h2>
                    <p className="mb-3 text-sm">Đang xem quảng cáo... {timeLeft} giây còn lại</p>
                    <div className="w-full bg-purple-300 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentAd?.duration || 0) - timeLeft) / (currentAd?.duration || 1) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {ads.map((ad) => (
                        <div key={ad.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
                            <h3 className="font-semibold mb-2 text-lg text-yellow-300">{ad.title}</h3>
                            <p className="text-xs mb-1 flex items-center">
                                <FaCoins className="text-yellow-400 mr-1" />
                                Phần thưởng: {ad.reward} xu
                            </p>
                            <p className="text-xs mb-3 flex items-center">
                                <FaClock className="text-gray-300 mr-1" />
                                Thời gian: {ad.duration} giây
                            </p>
                            <button
                                onClick={() => startWatchingAd(ad)}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-purple-800 px-3 py-2 rounded-md hover:from-yellow-500 hover:to-yellow-400 transition duration-300 flex items-center justify-center font-semibold text-sm"
                            >
                                <FaPlay className="mr-1" /> Xem ngay
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {ads.length === 0 && !isWatching && (
                <div className="text-center mt-6">
                    <p className="text-gray-300 mb-3 text-sm">Không còn quảng cáo nào!</p>
                    <button
                        onClick={refreshAds}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300 flex items-center justify-center mx-auto text-sm font-semibold"
                    >
                        <FaRedoAlt className="mr-1" /> Làm mới quảng cáo
                    </button>
                </div>
            )}
        </div>
    );
};

export default XemQuangCaoKiemTien;
