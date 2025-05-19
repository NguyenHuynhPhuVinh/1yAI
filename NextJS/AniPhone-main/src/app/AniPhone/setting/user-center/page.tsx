'use client'

import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from "react-icons/io";

const UserCenterPage = () => {
    const router = useRouter();
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [showGiftCodeModal, setShowGiftCodeModal] = useState(false);
    const [showExchangePointsModal, setShowExchangePointsModal] = useState(false);
    const [giftCode, setGiftCode] = useState('');
    const [points, setPoints] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [giftCodeMessage, setGiftCodeMessage] = useState('');
    const [exchangeMessage, setExchangeMessage] = useState('');

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        const lastCheckIn = window.localStorage.getItem('dailyCheckIn');
        if (lastCheckIn === today) {
            setHasCheckedIn(true);
        } else {
            setHasCheckedIn(false);
        }

        const updatePoints = () => {
            setPoints(parseInt(window.localStorage.getItem('point') || '0', 10));
        };

        updatePoints();
        const intervalId = setInterval(updatePoints, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCheckIn = () => {
        const today = new Date().toLocaleDateString();
        window.localStorage.setItem('dailyCheckIn', today);
        setHasCheckedIn(true);
        setShowCheckInModal(true);

        const newPoints = points + 50;
        setPoints(newPoints);
        window.localStorage.setItem('point', newPoints.toString());
    };

    const handleGiftCodeSubmit = () => {
        const giftCodes = ['TOMISAKAE', 'NEWPLAYER', 'GIFTUP'];
        const giftCodePoints = [100, 50, 200];
        const usedGiftCodes = JSON.parse(window.localStorage.getItem('usedGiftCodes') || '[]');

        const giftCodeIndex = giftCodes.indexOf(giftCode);

        if (giftCodeIndex !== -1 && !usedGiftCodes[giftCodeIndex]) {
            const giftCodePointsValue = giftCodePoints[giftCodeIndex];
            const newPoints = points + giftCodePointsValue;
            setPoints(newPoints);
            window.localStorage.setItem('point', newPoints.toString());

            usedGiftCodes[giftCodeIndex] = 1;
            window.localStorage.setItem('usedGiftCodes', JSON.stringify(usedGiftCodes));

            setGiftCodeMessage(`Bạn đã nhận được ${giftCodePointsValue} điểm!`);
        } else {
            setGiftCodeMessage("Mã quà tặng không hợp lệ hoặc đã được sử dụng!");
        }
        setGiftCode('');
    };

    const handleExchangePointsSubmit = (formData: { exchangeMethod: string, exchangeValue: string, pointsToExchange: string }) => {
        const pointsToExchangeNum = parseInt(formData.pointsToExchange);
        if (isNaN(pointsToExchangeNum) || pointsToExchangeNum <= 0 || pointsToExchangeNum > points) {
            setExchangeMessage("Số điểm không hợp lệ hoặc vượt quá số điểm hiện có!");
            return;
        }

        const exchangeAmount = pointsToExchangeNum * 1000;
        if (exchangeAmount > 0) {
            if (formData.exchangeMethod === 'phone') {
                const storedPhoneNumber = window.localStorage.getItem('phoneNumber');
                if (formData.exchangeValue !== storedPhoneNumber) {
                    setExchangeMessage("Số điện thoại không tồn tại hoặc không khớp!");
                    return;
                }
                const currentBalance = parseInt(window.localStorage.getItem('balance') || '0');
                const newBalance = currentBalance + exchangeAmount;
                window.localStorage.setItem('balance', newBalance.toString());
                setExchangeMessage(`Đã chuyển ${exchangeAmount.toLocaleString()}đ vào số điện thoại ${formData.exchangeValue}`);
                window.sessionStorage.setItem('Notification', `Đã chuyển ${exchangeAmount.toLocaleString()}đ vào số điện thoại ${formData.exchangeValue}`);
            } else if (formData.exchangeMethod === 'bank') {
                const storedCardNumber = window.localStorage.getItem('cardNumber');
                if (formData.exchangeValue !== storedCardNumber) {
                    setExchangeMessage("Số tài khoản ngân hàng không tồn tại hoặc không khớp!");
                    return;
                }
                const currentBankBalance = parseInt(window.localStorage.getItem('balanceBank') || '0');
                const newBankBalance = currentBankBalance + exchangeAmount;
                window.localStorage.setItem('balanceBank', newBankBalance.toString());
                setExchangeMessage(`Đã chuyển ${exchangeAmount.toLocaleString()}đ vào tài khoản ngân hàng ${formData.exchangeValue}`);
                window.sessionStorage.setItem('Notification', `Đã chuyển ${exchangeAmount.toLocaleString()}đ vào tài khoản ngân hàng ${formData.exchangeValue}`);
            }
            const newPoints = points - pointsToExchangeNum;
            setPoints(newPoints);
            window.localStorage.setItem('point', newPoints.toString());
        } else {
            setExchangeMessage("Bạn không đủ điểm để đổi!");
        }
    };

    const CheckInModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg max-w-xs w-full">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold mb-3">Điểm danh thành công!</h2>
                    <p className="mb-4">Nhận được 50 điểm.</p>
                    <button
                        onClick={() => setShowCheckInModal(false)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );

    const GiftCodeModal = () => {
        useEffect(() => {
            inputRef.current?.focus();
        }, []);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setGiftCode(e.target.value);
            inputRef.current?.focus();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg max-w-xs w-full">
                    <h2 className="text-xl font-bold mb-3">Nhập mã quà tặng</h2>
                    <input
                        ref={inputRef}
                        type="text"
                        value={giftCode}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Nhập mã quà tặng"
                    />
                    {giftCodeMessage && (
                        <p className={`text-sm mb-4 ${giftCodeMessage.includes("không hợp lệ") ? "text-red-500" : "text-green-500"}`}>
                            {giftCodeMessage}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setShowGiftCodeModal(false);
                                setGiftCodeMessage('');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mr-2"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleGiftCodeSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ExchangePointsModal = () => {
        const [formData, setFormData] = useState({
            exchangeMethod: '',
            exchangeValue: '',
            pointsToExchange: ''
        });

        const inputRef = useRef<HTMLInputElement>(null);
        const numRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (formData.exchangeMethod === 'phone' || formData.exchangeMethod === 'bank') {
                inputRef.current?.focus();
            } else {
                numRef.current?.focus();
            }
        }, [formData.exchangeMethod]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleExchangePointsSubmit(formData);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="bg-gray-800 text-white p-4 rounded-xl shadow-lg w-full max-w-xs mx-auto">
                    <h2 className="text-lg font-bold mb-3">Đổi điểm</h2>
                    <p className="text-sm mb-4">Số điểm hiện có: <span className="font-bold text-blue-400">{points}</span></p>
                    <div className="flex flex-col mb-4 space-y-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, exchangeMethod: 'phone' })}
                            className={`py-2 px-4 rounded-lg transition-colors ${formData.exchangeMethod === 'phone'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                                }`}
                        >
                            Số điện thoại
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, exchangeMethod: 'bank' })}
                            className={`py-2 px-4 rounded-lg transition-colors ${formData.exchangeMethod === 'bank'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                                }`}
                        >
                            Tài khoản ngân hàng
                        </button>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        name="exchangeValue"
                        value={formData.exchangeValue}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded text-sm"
                        placeholder={formData.exchangeMethod === 'phone' ? "Nhập số điện thoại" : "Nhập số tài khoản"}
                    />
                    <input
                        ref={numRef}
                        type="number"
                        name="pointsToExchange"
                        value={formData.pointsToExchange}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded text-sm"
                        placeholder="Nhập số điểm muốn đổi"
                    />
                    {exchangeMessage && (
                        <p className={`text-sm mb-4 ${exchangeMessage.includes("không") || exchangeMessage.includes("không đủ") ? "text-red-500" : "text-green-500"}`}>
                            {exchangeMessage}
                        </p>
                    )}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                setShowExchangePointsModal(false);
                                setExchangeMessage('');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Trung tâm người dùng</h1>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Điểm danh</span>
                            </div>
                            {!hasCheckedIn ? (
                                <button
                                    onClick={handleCheckIn}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Điểm danh
                                </button>
                            ) : (
                                <span className="text-green-500">Đã điểm danh</span>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowExchangePointsModal(true)}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Đổi điểm</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                        <div className="flex justify-between items-center cursor-pointer"
                            onClick={() => router.push('/AniPhone/setting/user-center/achievements')}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Thành tựu</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                        <div className="flex justify-between items-center cursor-pointer"
                            onClick={() => router.push('/AniPhone/setting/user-center/inbox')}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Hòm thư</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowGiftCodeModal(true)}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Mã quà</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 rounded-lg hover:opacity-90 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
                        <div className="relative flex justify-between items-center cursor-pointer" onClick={() => router.push('/AniPhone/setting/user-center/anistar')}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg text-white font-semibold">AniStar</span>
                            </div>
                            <IoIosArrowForward className="text-lg text-white" />
                        </div>
                    </div>
                </div>
            </div>
            {showCheckInModal && <CheckInModal />}
            {showGiftCodeModal && <GiftCodeModal />}
            {showExchangePointsModal && <ExchangePointsModal />}
        </div>
    );
};

export default UserCenterPage;
