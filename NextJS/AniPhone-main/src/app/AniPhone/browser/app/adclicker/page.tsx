'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeft, FaSearch, FaCoins } from 'react-icons/fa';

const AdClickerPage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [adViewed, setAdViewed] = useState(false);
    const [currentUrl,] = useState('aniw://adclicker.ani');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showCardInput, setShowCardInput] = useState(false);
    const [cardNumberAdClicker, setCardNumberAdClicker] = useState('');
    const [cardInputMessage, setCardInputMessage] = useState('');
    const [cardInputMessageType, setCardInputMessageType] = useState<'success' | 'error' | ''>('');
    const [adViewTime, setAdViewTime] = useState(0);
    const [isViewingAd, setIsViewingAd] = useState(false);
    const [adDuration, setAdDuration] = useState(0);

    useEffect(() => {
        const storedBalance = localStorage.getItem('adClickerBalance');
        if (storedBalance) {
            setBalance(parseFloat(storedBalance));
        }
        const savedCardNumber = window.sessionStorage.getItem('cardNumberAdClicker');
        if (savedCardNumber) {
            setCardNumberAdClicker(savedCardNumber);
        }
        // Mark the achievement for visiting AdClicker
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[22] === 0) {
            storedAchievementStatuses[22] = 1;
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'AdClicker');
        }
        // Mở khóa công việc 13
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[12] === -1) {
            storedJobs[12] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }

    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isViewingAd) {
            timer = setInterval(() => {
                setAdViewTime(prevTime => {
                    const newTime = prevTime + 1;
                    if (newTime >= adDuration) {
                        clearInterval(timer);
                        completeAdView();
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isViewingAd, adDuration]);

    const viewAd = () => {
        if (!adViewed) {
            const duration = Math.floor(Math.random() * 11) + 5; // Random duration between 5 and 15 seconds
            setAdDuration(duration);
            setIsViewingAd(true);
            setAdViewTime(0);
        }
    };

    const completeAdView = () => {
        const reward = Math.floor(Math.random() * 10) + 100; // Random reward between 100 and 109
        const newBalance = balance + reward;
        setBalance(newBalance);
        localStorage.setItem('adClickerBalance', newBalance.toString());
        setAdViewed(true);
        setIsViewingAd(false);
        showModalMessage(`Bạn đã nhận được ${reward} xu từ việc xem quảng cáo trong ${adDuration} giây!`);
        setTimeout(() => setAdViewed(false), 5000); // Reset after 5 seconds
    };

    const switchToWebApp = () => {
        router.push('/AniPhone/browser/app');
    };

    const showModalMessage = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    const handleExchangeCoins = () => {
        if (typeof window !== 'undefined') {
            if (balance < 10) {
                showModalMessage('Số xu không đủ để đổi. Cần ít nhất 10 xu.');
                return;
            }

            if (!cardNumberAdClicker) {
                setShowCardInput(true);
                return;
            }

            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance % 10;
            setBalance(newBalance);
            localStorage.setItem('adClickerBalance', newBalance.toString());

            const currentBankBalance = parseInt(localStorage.getItem('balanceBank') || '0', 10);
            const updatedBankBalance = currentBankBalance + exchangeAmount;
            localStorage.setItem('balanceBank', updatedBankBalance.toString());

            sessionStorage.setItem('Notification', `Bạn đã đổi ${exchangeAmount.toLocaleString()} đồng từ AdClicker và chuyển vào tài khoản ngân hàng!`);
            showModalMessage(`Đã đổi ${exchangeAmount.toLocaleString()} đồng thành công!`);
        }
    };

    const handleCardNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cardNumberAdClicker.length === 16 && typeof window !== 'undefined') {
            const storedCardNumber = localStorage.getItem('cardNumber');
            if (cardNumberAdClicker === storedCardNumber) {
                sessionStorage.setItem('cardNumberAdClicker', cardNumberAdClicker);
                setCardInputMessage('Mã thẻ ngân hàng hợp lệ.');
                setCardInputMessageType('success');
                setShowCardInput(false);
                handleExchangeCoins();
            } else {
                setCardInputMessage('Mã thẻ ngân hàng không khớp với thông tin đã lưu.');
                setCardInputMessageType('error');
            }
        } else {
            setCardInputMessage('Mã thẻ ngân hàng không hợp lệ. Vui lòng nhập 16 số.');
            setCardInputMessageType('error');
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                    <FaArrowLeft className="text-xl cursor-pointer mr-4" onClick={switchToWebApp} />
                    <div className="flex-grow flex items-center bg-gray-800 rounded-lg p-2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={currentUrl}
                            className="bg-transparent flex-grow outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex-grow bg-gray-900 rounded-lg p-4 mb-6 h-[76vh] overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4 text-center">AdClicker</h1>
                    <div className="mb-4 bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold flex items-center">
                            <FaCoins className="mr-2 text-yellow-400" />
                            Số dư: {balance} xu
                        </p>
                        <button
                            onClick={handleExchangeCoins}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Đổi xu
                        </button>
                    </div>
                    {showCardInput && (
                        <form onSubmit={handleCardNumberSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg">
                            <input
                                type="text"
                                value={cardNumberAdClicker}
                                onChange={(e) => setCardNumberAdClicker(e.target.value)}
                                placeholder="Nhập mã thẻ ngân hàng (16 số)"
                                className="w-full p-2 bg-gray-700 rounded-md mb-2"
                                maxLength={16}
                            />
                            {cardInputMessage && (
                                <p className={`my-2 ${cardInputMessageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {cardInputMessage}
                                </p>
                            )}
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                Xác nhận
                            </button>
                        </form>
                    )}
                    <div className="flex flex-col items-center justify-center mt-8">
                        <button
                            onClick={viewAd}
                            disabled={adViewed || isViewingAd}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl ${(adViewed || isViewingAd) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isViewingAd ? 'Đang xem quảng cáo' : adViewed ? 'Đợi quảng cáo tiếp theo' : 'Xem Quảng Cáo'}
                            {isViewingAd && <div className="mt-1">{`${adViewTime}s / ${adDuration}s`}</div>}
                        </button>
                        {isViewingAd && (
                            <div className="w-full mt-4 bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${(adViewTime / adDuration) * 100}%` }}
                                ></div>
                            </div>
                        )}
                        {isViewingAd && (
                            <p className="mt-2 text-sm text-gray-400">
                                Thời lượng quảng cáo: {adDuration}s
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 inline-block">
                        <p className="text-sm font-semibold break-words">{modalMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdClickerPage;
