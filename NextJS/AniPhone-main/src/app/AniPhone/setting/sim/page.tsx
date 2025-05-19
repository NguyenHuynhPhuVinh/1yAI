'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const SimPage = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [balance, setBalance] = useState(0);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    useEffect(() => {
        const storedPhoneNumber = window.localStorage.getItem('phoneNumber');
        const storedBalance = window.localStorage.getItem('balance');
        if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
        if (storedBalance) setBalance(Number(storedBalance));
    }, []);

    const handleRegister = () => {
        if (newPhoneNumber.length === 10 && /^0\d{9}$/.test(newPhoneNumber)) {
            setPhoneNumber(newPhoneNumber);
            setBalance(10000); // Số dư khởi đầu
            const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
            if (storedAchievementStatuses[0] === 0) {
                storedAchievementStatuses[0] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                window.sessionStorage.setItem('AchievementNotification', 'Người Mới');
            }
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('phoneNumber', newPhoneNumber);
                window.localStorage.setItem('balance', '10000');
            }
            setShowRegisterModal(false);
        }
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Quản lý SIM</h1>
                </div>
                {phoneNumber ? (
                    <div className="bg-[#1a1a1a] p-4 rounded-xl">
                        <h2 className="text-lg font-[500] mb-2">Thông tin SIM</h2>
                        <p>Số điện thoại: {phoneNumber}</p>
                        <p>Số dư: {balance.toLocaleString()} đ</p>
                    </div>
                ) : (
                    <div className="bg-[#1a1a1a] p-4 rounded-xl">
                        <h2 className="text-lg font-[500] mb-2">Chưa đăng ký SIM</h2>
                        <button
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            Đăng ký SIM mới
                        </button>
                    </div>
                )}
            </div>
            {showRegisterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center mx-4">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Đăng ký SIM mới</h2>
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại (10 số với 0 ở đầu)"
                            className={`w-full p-2 mb-4 rounded ${newPhoneNumber.length > 0
                                ? newPhoneNumber.length === 10 && /^0\d{9}$/.test(newPhoneNumber)
                                    ? 'bg-green-800 border-green-500'
                                    : 'bg-red-800 border-red-500'
                                : 'bg-gray-800'
                                } border-2`}
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowRegisterModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={`${newPhoneNumber.length === 10 && /^0\d{9}$/.test(newPhoneNumber)
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : 'bg-gray-500 cursor-not-allowed'
                                    } text-white font-bold py-2 px-4 rounded`}
                                onClick={handleRegister}
                                disabled={!(newPhoneNumber.length === 10 && /^0\d{9}$/.test(newPhoneNumber))}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimPage;
