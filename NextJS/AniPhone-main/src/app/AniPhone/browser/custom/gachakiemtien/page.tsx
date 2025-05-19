'use client'

import { useState, useEffect } from 'react';
import { FaCoins, FaExchangeAlt, FaGift } from 'react-icons/fa';

interface GachaItem {
    id: number;
    name: string;
    rarity: string;
    value: number;
    color: string;
    bgColor: string;
}

const GachaKiemTien = () => {
    const [balance, setBalance] = useState(0);
    const [coins, setCoins] = useState(0);
    const [items, setItems] = useState<GachaItem[]>([]);
    const [showExchange, setShowExchange] = useState(false);
    const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
    const [lastPull, setLastPull] = useState<GachaItem[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const gachaItems: GachaItem[] = [
        { id: 1, name: 'Xu thường', rarity: 'Phổ biến', value: 10, color: 'text-gray-400', bgColor: 'bg-gray-700' },
        { id: 2, name: 'Xu bạc', rarity: 'Hiếm', value: 50, color: 'text-green-500', bgColor: 'bg-green-900' },
        { id: 3, name: 'Xu vàng', rarity: 'Cực hiếm', value: 250, color: 'text-blue-500', bgColor: 'bg-blue-900' },
        { id: 4, name: 'Xu kim cương', rarity: 'Siêu hiếm', value: 2500, color: 'text-purple-500', bgColor: 'bg-purple-900' },
        { id: 5, name: 'Xu bạch kim', rarity: 'Huyền thoại', value: 10000, color: 'text-orange-500', bgColor: 'bg-orange-900' },
        { id: 6, name: 'Xu vũ trụ', rarity: 'Thần thoại', value: 50000, color: 'text-red-500', bgColor: 'bg-red-900' },
    ];

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balance');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const savedCoins = window.localStorage.getItem('gachaCoins');
        if (savedCoins) {
            setCoins(parseInt(savedCoins));
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[16] === 0) {
            storedAchievementStatuses[16] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web 5');
        }
        // Mở khóa công việc 9
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[8] === -1) {
            storedJobs[8] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    const pullGacha = (times: number) => {
        const cost = 5000 * times;
        if (balance < cost) {
            setShowInsufficientFundsModal(true);
            return;
        }

        const pulls: GachaItem[] = [];
        for (let i = 0; i < times; i++) {
            const randomNumber = Math.random();
            let selectedItem: GachaItem;

            if (randomNumber < 0.6) {
                selectedItem = gachaItems[0]; // 60% chance for common
            } else if (randomNumber < 0.95) {
                selectedItem = gachaItems[1]; // 35% chance for rare
            } else if (randomNumber < 0.98) {
                selectedItem = gachaItems[2]; // 3% chance for epic
            } else if (randomNumber < 0.9989) {
                selectedItem = gachaItems[3]; // 1.89% chance for legendary
            } else if (randomNumber < 0.9999) {
                selectedItem = gachaItems[4]; // 0.1% chance for super rare
            } else {
                selectedItem = gachaItems[5]; // 0.01% chance for mythical
            }
            pulls.push(selectedItem);
        }

        const newBalance = balance - cost;
        setBalance(newBalance);
        window.localStorage.setItem('balance', newBalance.toString());
        setLastPull(pulls);
        setItems([...pulls, ...items]);
        const totalCoins = pulls.reduce((sum, item) => sum + item.value, 0);
        const newCoins = coins + totalCoins;
        setCoins(newCoins);
        window.localStorage.setItem('gachaCoins', newCoins.toString());

        setNotificationMessage(`Bạn đã quay được ${pulls.length} lần (+${totalCoins} xu)`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleExchangeClick = () => {
        if (coins < 10) {
            setShowInsufficientFundsModal(true);
        } else {
            setShowExchange(true);
        }
    };

    const exchangeCoins = () => {
        if (typeof window !== 'undefined') {
            const exchangeAmount = Math.floor(coins / 10) * 1000;
            const newCoins = coins % 10;
            const newBalance = balance + exchangeAmount;
            setCoins(newCoins);
            setBalance(newBalance);
            window.localStorage.setItem('balance', newBalance.toString());
            window.localStorage.setItem('gachaCoins', newCoins.toString());

            setNotificationMessage(`Bạn đã đổi ${coins - newCoins} xu thành ${exchangeAmount.toLocaleString()} đồng`);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);

            setShowExchange(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Gacha Kiếm Tiền</h1>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                    <FaCoins className="text-yellow-400 mr-2 text-lg" />
                    <span className="font-bold text-lg">{balance.toLocaleString()} đ</span>
                </div>
                <div className="flex items-center">
                    <FaCoins className="text-yellow-400 mr-2 text-lg" />
                    <span className="font-bold text-lg">{coins} xu</span>
                </div>
            </div>
            <button
                onClick={handleExchangeClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center mb-4"
            >
                <FaExchangeAlt className="mr-2" />
                Đổi xu
            </button>
            <div className="text-center mb-4 flex flex-col space-y-4">
                <button
                    onClick={() => pullGacha(1)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300 text-xl font-bold flex items-center justify-center w-full"
                >
                    <FaGift className="mr-2" />
                    Quay x1 (5.000 đ)
                </button>
                <button
                    onClick={() => pullGacha(10)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300 text-xl font-bold flex items-center justify-center w-full"
                >
                    <FaGift className="mr-2" />
                    Quay x10 (50.000 đ)
                </button>
            </div>
            {lastPull.length > 0 && (
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 text-center">
                    <h2 className="text-xl font-bold mb-2">Kết quả gần nhất</h2>
                    {lastPull.map((item, index) => (
                        <p key={index} className={`text-lg ${item.color}`}>
                            {item.name} - {item.rarity} (+{item.value} xu)
                        </p>
                    ))}
                </div>
            )}
            <div className="flex-grow overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">Lịch sử quay</h3>
                <div className="grid grid-cols-1 gap-2">
                    {items.map((item, index) => (
                        <div key={index} className={`rounded-lg shadow-lg p-3 flex justify-between items-center ${item.bgColor}`}>
                            <div>
                                <h4 className={`font-semibold ${item.color}`}>{item.name}</h4>
                                <p className="text-sm text-gray-300">{item.rarity}</p>
                            </div>
                            <p className={`${item.color}`}>+{item.value} xu</p>
                        </div>
                    ))}
                </div>
            </div>
            {showExchange && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-xs w-full">
                        <h2 className="text-xl font-bold mb-4">Đổi xu</h2>
                        <p className="mb-4">Đổi {Math.floor(coins / 10) * 10} xu thành {(Math.floor(coins / 10) * 1000).toLocaleString()} đồng?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowExchange(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-full mr-2 hover:bg-gray-700 transition duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={exchangeCoins}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showInsufficientFundsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-xs w-full">
                        <h2 className="text-xl font-bold mb-4">Không đủ tiền/xu</h2>
                        <p className="mb-4">Cần tối thiểu 5.000 đồng để quay gacha hoặc 10 xu để đổi.</p>
                        <button
                            onClick={() => setShowInsufficientFundsModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {showNotification && (
                <div className="fixed bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg text-center">
                    {notificationMessage}
                </div>
            )}
        </div>
    );
};

export default GachaKiemTien;
