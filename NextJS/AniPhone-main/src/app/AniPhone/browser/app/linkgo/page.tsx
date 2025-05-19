'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeft, FaCoins, FaExternalLinkAlt, FaSearch, FaSpinner, FaCheck } from 'react-icons/fa';

interface Step {
    type: 'captcha' | 'timer' | 'humanVerification';
    text?: string;
    duration?: number;
}

interface Link {
    id: number;
    shortLink: string;
    steps: Step[];
}

const LinkGoPage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState('');
    const [, setSuccess] = useState('');
    const [currentUrl, setCurrentUrl] = useState('aniw://linkgo.ani');
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [timerProgress, setTimerProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [cardNumberLinkGo, setCardNumberLinkGo] = useState('');
    const [showCardInput, setShowCardInput] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [cardInputMessage, setCardInputMessage] = useState('');
    const [cardInputMessageType, setCardInputMessageType] = useState<'success' | 'error' | ''>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const generateRandomCaptcha = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const generateRandomDuration = () => {
        return Math.floor(Math.random() * 11) + 5; // Random duration between 5 and 15 seconds
    };

    const generateRandomSteps = () => {
        const numberOfSteps = Math.floor(Math.random() * 3) + 2; // Random number of steps between 2 and 4
        const steps: Step[] = [];
        for (let i = 0; i < numberOfSteps; i++) {
            const randomStep = Math.random();
            if (randomStep < 0.33) {
                steps.push({ type: 'captcha', text: `Nhập mã Captcha sau: ${generateRandomCaptcha()}` });
            } else if (randomStep < 0.66) {
                steps.push({ type: 'timer', duration: generateRandomDuration() });
            } else {
                steps.push({ type: 'humanVerification', text: 'Xác nhận bạn không phải là người máy' });
            }
        }
        return steps;
    };

    const generateRandomLink = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return `aniw://linkgo.ani/${result}`;
    };

    const predefinedLinks: Link[] = [
        {
            id: 1,
            shortLink: generateRandomLink(),
            steps: generateRandomSteps()
        },
        {
            id: 2,
            shortLink: generateRandomLink(),
            steps: generateRandomSteps()
        },
        {
            id: 3,
            shortLink: generateRandomLink(),
            steps: generateRandomSteps()
        }
    ];

    useEffect(() => {
        const savedBalance = window.localStorage.getItem('balanceLinkGo');
        if (savedBalance) {
            setBalance(parseInt(savedBalance));
        }
        const savedCardNumber = window.sessionStorage.getItem('cardNumberLinkGo');
        if (savedCardNumber) {
            setCardNumberLinkGo(savedCardNumber);
        }
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[18] === 0) {
            storedAchievementStatuses[18] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'LinkGO');
        }
        // Mở khóa công việc 10
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        if (storedJobs[9] === -1) {
            storedJobs[9] = 0;
            localStorage.setItem('jobs', JSON.stringify(storedJobs));
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (selectedLink && selectedLink.steps[step]?.type === 'timer') {
            const duration = selectedLink.steps[step].duration || 0;
            let progress = 0;
            timer = setInterval(() => {
                progress += 1;
                setTimerProgress((progress / duration) * 100);
                if (progress >= duration) {
                    clearInterval(timer);
                    proceedToNextStep();
                }
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLink, step]);

    const handleVisitLink = (link: Link) => {
        setSelectedLink(link);
        setCurrentUrl(link.shortLink);
        setStep(0);
        setTimerProgress(0);
        setIsVerified(false);
    };

    const handleCaptchaSubmit = (input: string) => {
        if (selectedLink && input.toLowerCase() === selectedLink.steps[step].text?.split(': ')[1].toLowerCase()) {
            proceedToNextStep();
        } else {
            setError('Mã Captcha không chính xác');
        }
    };

    const handleHumanVerification = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 2000);
    };

    const proceedToNextStep = () => {
        setError('');
        setSuccess('');
        setTimerProgress(0);
        setIsVerifying(false);
        setIsVerified(false);
        if (selectedLink && step < selectedLink.steps.length - 1) {
            setIsLoading(true);
            setTimeout(() => {
                setStep(step + 1);
                setIsLoading(false);
            }, 2000);
        } else {
            handleFinalStep();
        }
    };

    const handleFinalStep = () => {
        const reward = Math.floor(Math.random() * 51) + 50; // Tăng phạm vi từ 50 đến 100 xu
        const newBalance = balance + reward;
        setBalance(newBalance);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('balanceLinkGo', newBalance.toString());
        }
        showModalMessage(`Bạn đã nhận được ${reward} xu từ việc truy cập link!`);
        setCurrentUrl('aniw://linkgo.ani');
        setSelectedLink(null);
        predefinedLinks.forEach(link => link.shortLink = generateRandomLink()); // Generate new random links
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

            if (!cardNumberLinkGo) {
                setShowCardInput(true);
                return;
            }

            const exchangeAmount = Math.floor(balance / 10) * 1000;
            const newBalance = balance % 10;
            setBalance(newBalance);
            window.localStorage.setItem('balanceLinkGo', newBalance.toString());

            // Chỉ cập nhật số dư ngân hàng
            const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0', 10);
            const updatedBankBalance = currentBankBalance + exchangeAmount;
            window.localStorage.setItem('balanceBank', updatedBankBalance.toString());

            window.sessionStorage.setItem('Notification', `Bạn đã đổi ${exchangeAmount.toLocaleString()} đồng từ LinkGo và chuyển vào tài khoản ngân hàng!`);
        }
    };

    const handleCardNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (cardNumberLinkGo.length === 16 && typeof window !== 'undefined') {
            const storedCardNumber = window.localStorage.getItem('cardNumber');
            if (cardNumberLinkGo === storedCardNumber) {
                window.sessionStorage.setItem('cardNumberLinkGo', cardNumberLinkGo);
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

    const switchToWebApp = () => {
        router.push('/AniPhone/browser/app');
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
                    {!selectedLink && (
                        <>
                            <h1 className="text-2xl font-bold mb-4 text-center">LinkGO</h1>
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
                                        value={cardNumberLinkGo}
                                        onChange={(e) => setCardNumberLinkGo(e.target.value)}
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
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold mb-3">Danh sách link rút gọn</h2>
                                {predefinedLinks.map(link => (
                                    <div key={link.id} className="bg-gray-800 p-3 rounded-lg">
                                        <p className="text-sm font-semibold mb-2">Link rút gọn:</p>
                                        <div className="flex flex-col bg-gray-700 p-2 rounded">
                                            <span className="text-blue-400 text-sm mb-2 break-all">{link.shortLink}</span>
                                            <button
                                                onClick={() => handleVisitLink(link)}
                                                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center text-sm"
                                            >
                                                <FaExternalLinkAlt className="mr-2" />
                                                Truy cập
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {selectedLink && !isLoading && step < selectedLink.steps.length && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Bước {step + 1}/{selectedLink.steps.length}</h2>
                            {selectedLink.steps[step].type === 'captcha' && (
                                <>
                                    <p className="mb-2">{selectedLink.steps[step].text}</p>
                                    <input
                                        type="text"
                                        onChange={(e) => handleCaptchaSubmit(e.target.value)}
                                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                        placeholder="Nhập mã Captcha"
                                    />
                                </>
                            )}
                            {selectedLink.steps[step].type === 'timer' && (
                                <>
                                    <p className="mb-4">Vui lòng đợi {selectedLink.steps[step].duration} giây...</p>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${timerProgress}%` }}></div>
                                    </div>
                                </>
                            )}
                            {selectedLink.steps[step].type === 'humanVerification' && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={handleHumanVerification}
                                            className={`w-6 h-6 border-2 rounded-md ${isVerifying ? 'border-blue-500' : isVerified ? 'border-green-500 bg-green-500' : 'border-gray-500'} flex items-center justify-center relative`}
                                            disabled={isVerifying || isVerified}
                                        >
                                            {isVerifying && (
                                                <FaSpinner className="animate-spin text-blue-500 absolute text-xs" />
                                            )}
                                            {isVerified && <FaCheck className="text-white text-xs" />}
                                        </button>
                                        <span className="text-md">Xác thực bạn không phải là người máy.</span>
                                    </div>
                                    {isVerified && (
                                        <button
                                            onClick={proceedToNextStep}
                                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-300 text-lg font-semibold"
                                        >
                                            Tiếp tục
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                            <p className="text-lg">Đang chuyển hướng, vui lòng đợi...</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mt-4">{error}</p>}
                </div>
            </div>
            {
                showModal && (
                    <div className="fixed top-[15vh] left-1/2 transform -translate-x-1/2 z-50">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 inline-block">
                            <p className="text-sm font-semibold whitespace-nowrap">{modalMessage}</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LinkGoPage;