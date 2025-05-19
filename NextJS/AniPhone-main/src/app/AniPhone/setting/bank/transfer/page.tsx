'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';
import { IoMdWallet } from 'react-icons/io';

const TransferPage = () => {
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bankBalance, setBankBalance] = useState(0);

    useEffect(() => {
        const storedBankBalance = window.localStorage.getItem('balanceBank');
        if (storedBankBalance) {
            setBankBalance(parseInt(storedBankBalance));
        }
    }, []);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleTransfer = () => {
        if (typeof window !== 'undefined') {
            if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                setError('Số thẻ không hợp lệ. Vui lòng nhập 16 chữ số.');
                setSuccess(false);
                return;
            }

            const transferAmount = parseInt(amount);
            if (isNaN(transferAmount) || transferAmount <= 0) {
                setError('Số tiền không hợp lệ');
                setSuccess(false);
                return;
            }

            if (transferAmount > bankBalance) {
                setError('Số dư tài khoản không đủ');
                setSuccess(false);
                return;
            }

            // Thực hiện chuyển tiền
            const newBankBalance = bankBalance - transferAmount;
            setBankBalance(newBankBalance);
            window.localStorage.setItem('balanceBank', newBankBalance.toString());

            // Set notification
            window.sessionStorage.setItem('Notification', `Bạn đã chuyển thành công ${transferAmount.toLocaleString()} đồng đến số thẻ ${cardNumber}`);

            setSuccess(true);
            setError('');
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 flex-grow">
                <div className="flex items-center mb-6">
                    <FaArrowLeft
                        className="text-2xl cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/bank')}
                    />
                    <h1 className="text-2xl font-bold mx-4">Chuyển tiền</h1>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <label className="block mb-2 text-lg font-semibold text-blue-400">
                            <FaCreditCard className="inline mr-2" />
                            Số thẻ người nhận
                        </label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Nhập số thẻ người nhận"
                        />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <label className="block mb-2 text-lg font-semibold text-green-400">
                            <IoMdWallet className="inline mr-2" />
                            Số tiền chuyển
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            placeholder="Nhập số tiền cần chuyển"
                        />
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                    {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">Chuyển tiền thành công!</p>}
                    <button
                        onClick={handleTransfer}
                        className="w-full p-3 bg-blue-600 text-white rounded-md font-bold text-base hover:bg-blue-700 transition duration-300"
                    >
                        Chuyển tiền
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferPage;
