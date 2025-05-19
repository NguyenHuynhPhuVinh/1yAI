'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdWallet } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const DepositPage = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState(0);
    const [bankBalance, setBankBalance] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const storedBankBalance = window.localStorage.getItem('balanceBank');
        if (storedBankBalance) {
            setBankBalance(parseInt(storedBankBalance));
        }
    }, []);

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        setError('');
        setSuccess(false);
    };

    const handleAmountChange = (selectedAmount: number) => {
        setAmount(selectedAmount);
        setError('');
        setSuccess(false);
    };

    const handleDeposit = () => {
        if (typeof window !== 'undefined') {
            const storedPhoneNumber = window.localStorage.getItem('phoneNumber');

            if (!phoneNumber || phoneNumber.length !== 10 || !phoneNumber.startsWith('0')) {
                setError('Số điện thoại không hợp lệ');
                return;
            }

            if (phoneNumber !== storedPhoneNumber) {
                setError('Số điện thoại không khớp với số điện thoại đã đăng ký');
                return;
            }

            if (amount === 0) {
                setError('Vui lòng chọn mệnh giá');
                return;
            }

            if (amount > bankBalance) {
                setError('Số dư tài khoản không đủ');
                return;
            }

            // Clear error if all checks pass
            setError('');

            // Cập nhật số dư
            const newBankBalance = bankBalance - amount;
            setBankBalance(newBankBalance);
            window.localStorage.setItem('balanceBank', newBankBalance.toString());

            // Cập nhật số dư điện thoại
            const currentBalance = parseInt(window.localStorage.getItem('balance') || '0');
            const newBalance = currentBalance + amount;
            window.localStorage.setItem('balance', newBalance.toString());

            // Set notification
            window.sessionStorage.setItem('Notification', `Bạn đã nạp thành công ${amount.toLocaleString()} đồng vào tài khoản điện thoại`);

            // Set success state
            setSuccess(true);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <Nav />
            <div className="p-6">
                <div className="flex items-center mb-8">
                    <FaArrowLeftLong className='text-2xl cursor-pointer text-blue-400'
                        onClick={() => router.push('/AniPhone/setting/bank')}
                    />
                    <h1 className="text-2xl font-bold mx-4">Nạp tiền</h1>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <label className="block mb-2 text-lg font-semibold text-blue-400">
                            <FaPhoneAlt className="inline mr-2" />
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <label className="block mb-2 text-lg font-semibold text-green-400">
                            <IoMdWallet className="inline mr-2" />
                            Chọn mệnh giá
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[10000, 20000, 50000, 100000, 200000, 500000].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => handleAmountChange(value)}
                                    className={`p-2 rounded-md text-sm transition duration-300 ${amount === value ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    {value.toLocaleString()} đ
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                    {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">Nạp tiền thành công!</p>}
                    <button
                        onClick={handleDeposit}
                        className="w-full p-3 bg-blue-600 text-white rounded-md font-bold text-base hover:bg-blue-700 transition duration-300"
                    >
                        Nạp tiền
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepositPage;
