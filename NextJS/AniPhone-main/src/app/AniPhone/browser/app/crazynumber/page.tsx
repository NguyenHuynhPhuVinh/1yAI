'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeft, FaCoins, FaRandom, FaCheck, FaTimes, FaSearch, FaCreditCard } from 'react-icons/fa';

const CrazyNumberPage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [cardNumberCrazyNumber, setCardNumberCrazyNumber] = useState('');
    const [showCardInput, setShowCardInput] = useState(false);
    const [cardInputMessage, setCardInputMessage] = useState('');
    const [cardInputMessageType, setCardInputMessageType] = useState<'success' | 'error' | ''>('');
    const [gameActive, setGameActive] = useState(false);
    const [currentUrl,] = useState('aniw://crazynumber.ani');
    const [topUpAmount, setTopUpAmount] = useState('');
    const [showTopUpInput, setShowTopUpInput] = useState(false);
    const [isTopUp, setIsTopUp] = useState(false);
    const [winningNumbers, setWinningNumbers] = useState<number[][]>([]);

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceCrazyNumber');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const savedCardNumber = window.sessionStorage.getItem('cardNumberCrazyNumber');
        if (savedCardNumber) {
            setCardNumberCrazyNumber(savedCardNumber);
        }
        // Mark the achievement for visiting CrazyNumber
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[20] === 0) {
            storedAchievementStatuses[20] = 1;
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'CrazyNumber');
        }
        // Mở khóa công việc 11
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[10] === -1) {
            storedJobs[10] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    const startNewGame = () => {
        if (balance < 10) {
            showModalMessage('Bạn cần ít nhất 10 xu để chơi.');
            return;
        }
        const numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
        setDrawnNumbers(numbers);
        setWinningNumbers(Array.from({ length: 12 }, () =>
            Array.from({ length: 5 }, () => Math.floor(Math.random() * 10))
        ));
        setGameActive(true);
        setMessage('');
        setMessageType('');
        setBalance(prevBalance => prevBalance - 10);
        window.localStorage.setItem('balanceCrazyNumber', (balance - 10).toString());
    };

    const calculateReward = () => {
        const drawnNumberString = drawnNumbers.join('');
        let reward = 0;

        for (let i = 0; i < winningNumbers.length; i++) {
            const winningNumberString = winningNumbers[i].join('');
            if (drawnNumberString === winningNumberString) {
                reward = 20000000;
                break;
            } else if (drawnNumberString.slice(-4) === winningNumberString.slice(-4)) {
                reward = 1000000;
                break;
            } else if (drawnNumberString.slice(-3) === winningNumberString.slice(-3)) {
                reward = 50000;
                break;
            } else if (drawnNumberString.slice(-2) === winningNumberString.slice(-2)) {
                reward = 1000;
                break;
            } else if (drawnNumberString.slice(-1) === winningNumberString.slice(-1)) {
                reward = 1;
                break;
            }
        }

        return reward;
    };

    const handleDrawResult = () => {
        const reward = calculateReward();
        if (reward > 0) {
            const newBalance = balance + reward;
            setBalance(newBalance);
            window.localStorage.setItem('balanceCrazyNumber', newBalance.toString());
            setMessage(`Chúc mừng! Bạn đã trúng ${reward} xu.`);
            setMessageType('success');
        } else {
            setMessage('Rất tiếc, bạn không trúng giải nào.');
            setMessageType('error');
        }
        setGameActive(false);
    };

    const handleExchangeCoins = () => {
        if (typeof window !== 'undefined') {
            if (balance < 10) {
                showModalMessage('Số xu không đủ để đổi. Cần ít nhất 10 xu.');
                return;
            }

            if (!cardNumberCrazyNumber) {
                setIsTopUp(false);
                setShowCardInput(true);
                return;
            }

            // Thực hiện đổi xu ngay lập tức
            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance % 10;
            setBalance(newBalance);
            window.localStorage.setItem('balanceCrazyNumber', newBalance.toString());

            const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0', 10);
            const updatedBankBalance = currentBankBalance + exchangeAmount;
            window.localStorage.setItem('balanceBank', updatedBankBalance.toString());

            window.sessionStorage.setItem('Notification', `Bạn đã đổi ${exchangeAmount.toLocaleString()} đồng từ CrazyNumber và chuyển vào tài khoản ngân hàng!`);
            showModalMessage(`Đã đổi thành công ${exchangeAmount.toLocaleString()} đồng!`);
        }
    };

    const handleTopUp = () => {
        if (!cardNumberCrazyNumber) {
            setIsTopUp(true);
            setShowCardInput(true);
            return;
        }
        setShowTopUpInput(!showTopUpInput);
        setCardInputMessage('');
    };

    const handleCardNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cardNumberCrazyNumber.length === 16 && typeof window !== 'undefined') {
            const storedCardNumber = window.localStorage.getItem('cardNumber');
            if (cardNumberCrazyNumber === storedCardNumber) {
                window.sessionStorage.setItem('cardNumberCrazyNumber', cardNumberCrazyNumber);
                setCardInputMessage('Mã thẻ ngân hàng hợp lệ.');
                setCardInputMessageType('success');
                setShowCardInput(false);
                if (isTopUp) {
                    setShowTopUpInput(true);
                } else {
                    handleExchangeCoins();
                }
            } else {
                setCardInputMessage('Mã thẻ ngân hàng không khớp với thông tin đã lưu.');
                setCardInputMessageType('error');
            }
        } else {
            setCardInputMessage('Mã thẻ ngân hàng không hợp lệ. Vui lòng nhập 16 số.');
            setCardInputMessageType('error');
        }
    };

    const showModalMessage = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };

    const switchToWebApp = () => {
        router.push('/AniPhone/browser/app');
    };

    const handleTopUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const amount = parseInt(topUpAmount);
        if (isNaN(amount) || amount < 1000) {
            setCardInputMessage('Số tiền không hợp lệ. Vui lòng nhập số tiền từ 1.000 đồng trở lên.');
            setCardInputMessageType('error');
            return;
        }

        const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0', 10);
        if (currentBankBalance < amount) {
            setCardInputMessage('Số dư tài khoản ngân hàng không đủ để thực hiện giao dịch này.');
            setCardInputMessageType('error');
            return;
        }

        const coinsToAdd = Math.floor(amount / 1000) * 10;
        const newBalance = balance + coinsToAdd;
        setBalance(newBalance);
        window.localStorage.setItem('balanceCrazyNumber', newBalance.toString());

        // Trừ tiền từ tài khoản ngân hàng
        const updatedBankBalance = currentBankBalance - amount;
        window.localStorage.setItem('balanceBank', updatedBankBalance.toString());

        setCardInputMessage(`Nạp thành công ${coinsToAdd} xu vào tài khoản.`);
        setCardInputMessageType('success');
        setTopUpAmount('');
        setShowTopUpInput(false);
        showModalMessage(`Bạn đã nạp thành công ${coinsToAdd} xu vào tài khoản!`);
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
                    <h1 className="text-2xl font-bold mb-4 text-center">CrazyNumber</h1>
                    <div className="mb-4 bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold flex items-center">
                            <FaCoins className="mr-2 text-yellow-400" />
                            Số dư: {balance} xu
                        </p>
                        <div className="flex mt-2 space-x-2">
                            <button
                                onClick={handleExchangeCoins}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
                            >
                                Đổi xu
                            </button>
                            <button
                                onClick={handleTopUp}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                            >
                                <FaCreditCard className="mr-2" />
                                Nạp xu
                            </button>
                        </div>
                    </div>
                    {showCardInput && (
                        <form onSubmit={handleCardNumberSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg">
                            <input
                                type="text"
                                value={cardNumberCrazyNumber}
                                onChange={(e) => setCardNumberCrazyNumber(e.target.value)}
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
                    {showTopUpInput && (
                        <form onSubmit={handleTopUpSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg">
                            <input
                                type="number"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                placeholder="Nhập số tiền nạp (VNĐ)"
                                className="w-full p-2 bg-gray-700 rounded-md mb-2"
                                min="1000"
                                step="1000"
                            />
                            <p className="text-sm text-gray-400 mb-2">1.000 đồng = 10 xu</p>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                Nạp xu
                            </button>
                            {cardInputMessage && (
                                <p className={`my-2 ${cardInputMessageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {cardInputMessage}
                                </p>
                            )}
                        </form>
                    )}
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <h2 className="text-xl font-bold mb-4">Quay số may mắn</h2>
                        <p className="mb-2">Quay 5 số ngẫu nhiên từ 0 đến 9. Mỗi lượt chơi tốn 10 xu.</p>
                        <button
                            onClick={startNewGame}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                            disabled={gameActive}
                        >
                            <FaRandom className="mr-2" />
                            Bắt đầu quay số
                        </button>
                    </div>
                    {gameActive && (
                        <div className="bg-gray-800 p-4 rounded-lg mb-4">
                            <p className="mb-2">Số của bạn:</p>
                            <div className="flex justify-center space-x-2 mb-4">
                                {drawnNumbers.map((number, index) => (
                                    <span key={index} className="bg-blue-500 text-white px-3 py-2 rounded-md text-xl font-bold">
                                        {number}
                                    </span>
                                ))}
                            </div>
                            <p className="mb-2">Số trúng thưởng:</p>
                            {winningNumbers.map((numbers, index) => (
                                <div key={index} className="flex justify-center space-x-2 mb-2">
                                    {numbers.map((number, idx) => (
                                        <span key={idx} className="bg-green-500 text-white px-3 py-2 rounded-md text-xl font-bold">
                                            {number}
                                        </span>
                                    ))}
                                </div>
                            ))}
                            <button
                                onClick={handleDrawResult}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 w-full"
                            >
                                Xem kết quả
                            </button>
                        </div>
                    )}
                    {message && (
                        <div className={`p-3 rounded-md mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <p className="flex items-center">
                                {messageType === 'success' ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
                                {message}
                            </p>
                        </div>
                    )}
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-bold mb-2">Bảng giá thưởng:</h3>
                        <ul className="list-disc pl-5">
                            <li>Trùng 1 số cuối với bất kỳ dãy số nào: 1 xu</li>
                            <li>Trùng 2 số cuối với bất kỳ dãy số nào: 1000 xu</li>
                            <li>Trùng 3 số cuối với bất kỳ dãy số nào: 50.000 xu</li>
                            <li>Trùng 4 số cuối với bất kỳ dãy số nào: 1.000.000 xu</li>
                            <li>Trùng 5 số với bất kỳ dãy số nào: 20.000.000 xu</li>
                        </ul>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 inline-block">
                        <p className="text-sm font-semibold whitespace-nowrap">{modalMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrazyNumberPage;