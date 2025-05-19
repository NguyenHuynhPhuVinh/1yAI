'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaUniversity } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { GiReceiveMoney } from "react-icons/gi";
import { MdCreditCardOff } from "react-icons/md";

const BankSettingsPage = () => {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [, setHasCard] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [showOpenCardForm, setShowOpenCardForm] = useState(false);
    const [fullName, setFullName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [showCardInfoModal, setShowCardInfoModal] = useState(false);
    const [showNewCardModal, setShowNewCardModal] = useState(false);
    const [showCancelCardModal, setShowCancelCardModal] = useState(false);
    const [nameError, setNameError] = useState('');
    const [idError, setIdError] = useState('');

    useEffect(() => {
        const storedBalance = window.localStorage.getItem('balanceBank');
        if (storedBalance) {
            setBalance(parseInt(storedBalance));
        }
        const storedCardNumber = window.localStorage.getItem('cardNumber');
        const storedFullName = window.localStorage.getItem('cardHolderName');
        if (storedCardNumber && storedFullName) {
            setHasCard(true);
            setCardNumber(storedCardNumber);
            setFullName(storedFullName);
        } else {
            setShowOpenCardForm(true);
        }
    }, []);

    const validateName = (name: string) => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
    };

    const validateId = (id: string) => {
        return /^\d{12}$/.test(id);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFullName(name);
        if (name && !validateName(name)) {
            setNameError('Tên phải có ít nhất 2 từ và chỉ chứa chữ cái (bao gồm dấu tiếng Việt)');
        } else {
            setNameError('');
        }
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.value;
        setIdNumber(id);
        if (id && !validateId(id)) {
            setIdError('Mã CCCD phải có đúng 12 chữ số');
        } else {
            setIdError('');
        }
    };

    const handleOpenCard = () => {
        if (!validateName(fullName) || !validateId(idNumber)) {
            return;
        }

        const newCardNumber = generateCardNumber();
        setCardNumber(newCardNumber);
        setHasCard(true);
        setShowOpenCardForm(false);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('cardNumber', newCardNumber);
            window.localStorage.setItem('cardHolderName', fullName);
            window.localStorage.setItem('balanceBank', '0');
            const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
            if (storedAchievementStatuses[1] === 0) {
                storedAchievementStatuses[1] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                window.sessionStorage.setItem('AchievementNotification', 'Khởi Đầu');
            }
        }
        setBalance(0);
        setShowNewCardModal(true);
    };

    const handleCancelCard = () => {
        setShowCancelCardModal(true);
    };

    const confirmCancelCard = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('cardNumber');
            window.localStorage.removeItem('cardHolderName');
            window.localStorage.removeItem('balanceBank');
        }
        setHasCard(false);
        setCardNumber('');
        setFullName('');
        setBalance(0);
        setShowCancelCardModal(false);
        setShowOpenCardForm(true);
    };

    const generateCardNumber = () => {
        return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    };

    const NewCardModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Thẻ đã được mở thành công</h2>
                    <button
                        onClick={() => setShowNewCardModal(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>
                <div>
                    <p className="mb-4">Chúc mừng! Thẻ của bạn đã được mở thành công.</p>
                    <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-400 mb-1">Số thẻ của bạn:</p>
                        <p className="text-xl font-mono">{cardNumber}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-400 mb-1">Chủ thẻ:</p>
                        <p className="text-xl">{fullName}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-400 mb-1">Số dư:</p>
                        <p className="text-xl">0 đ</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowNewCardModal(false)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    const CardInfoModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Thông tin thẻ</h2>
                    <button
                        onClick={() => setShowCardInfoModal(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-400 mb-1">Số thẻ của bạn:</p>
                    <p className="text-xl font-mono">{cardNumber}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-400 mb-1">Chủ thẻ:</p>
                    <p className="text-xl">{fullName}</p>
                </div>
                <button
                    onClick={() => setShowCardInfoModal(false)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    const CancelCardModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Hủy thẻ</h2>
                    <button
                        onClick={() => setShowCancelCardModal(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>
                <p className="mb-6">Bạn có chắc chắn muốn hủy thẻ không? Hành động này không thể hoàn tác.</p>
                <div className="flex justify-between">
                    <button
                        onClick={() => setShowCancelCardModal(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={confirmCancelCard}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Xác nhận hủy thẻ
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Ngân hàng</h1>
                </div>
                {showOpenCardForm ? (
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={fullName}
                                onChange={handleNameChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            />
                            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Số CMND/CCCD"
                                value={idNumber}
                                onChange={handleIdChange}
                                className="w-full p-2 bg-gray-800 rounded"
                            />
                            {idError && <p className="text-red-500 text-sm mt-1">{idError}</p>}
                        </div>
                        <button
                            onClick={handleOpenCard}
                            className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                            disabled={!validateName(fullName) || !validateId(idNumber)}
                        >
                            Mở thẻ
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-[#1a1a1a] p-4 rounded-xl mb-4">
                            <h2 className="text-lg font-[500] mb-2">Số dư tài khoản</h2>
                            <p className="text-2xl font-bold text-green-500">{balance.toLocaleString()} đ</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                <div className="flex justify-between items-center cursor-pointer"
                                    onClick={() => router.push('/AniPhone/setting/bank/transfer')}>
                                    <div className="flex items-center gap-2">
                                        <FaUniversity className="text-xl text-blue-500" />
                                        <span className="text-lg">Chuyển tiền</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                            <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                <div className="flex justify-between items-center cursor-pointer"
                                    onClick={() => router.push('/AniPhone/setting/bank/deposit')}>
                                    <div className="flex items-center gap-2">
                                        <GiReceiveMoney className="text-xl text-green-500" />
                                        <span className="text-lg">Nạp tiền</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                            <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                <div className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setShowCardInfoModal(true)}>
                                    <div className="flex items-center gap-2">
                                        <FaCreditCard className="text-xl text-purple-500" />
                                        <span className="text-lg">Thông tin thẻ</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                            <div className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-all duration-300">
                                <div className="flex justify-between items-center cursor-pointer"
                                    onClick={handleCancelCard}>
                                    <div className="flex items-center gap-2">
                                        <MdCreditCardOff className="text-xl text-red-500" />
                                        <span className="text-lg">Hủy thẻ</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showNewCardModal && <NewCardModal />}
            {showCardInfoModal && <CardInfoModal />}
            {showCancelCardModal && <CancelCardModal />}
        </div>
    );
};

export default BankSettingsPage;
