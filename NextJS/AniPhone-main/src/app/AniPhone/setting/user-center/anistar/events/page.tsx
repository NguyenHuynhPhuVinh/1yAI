'use client'

import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaGift } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';

const EventsPage = () => {
    const router = useRouter();
    const [claimedRewards, setClaimedRewards] = useState<boolean[]>([]);
    const [points, setPoints] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [, setCurrentLoginDate] = useState('');
    const [loginCount, setLoginCount] = useState(0);

    useEffect(() => {
        const storedClaimedRewards = JSON.parse(localStorage.getItem('claimedLoginRewards') || '[]');
        const storedCurrentLoginDate = localStorage.getItem('currentLoginDate') || '';
        const storedLoginCount = parseInt(localStorage.getItem('loginCount') || '0');

        setClaimedRewards(storedClaimedRewards);
        setCurrentLoginDate(storedCurrentLoginDate);
        setLoginCount(storedLoginCount);

        const today = new Date().toDateString();
        if (storedCurrentLoginDate !== today) {
            const newLoginCount = storedLoginCount + 1;
            setLoginCount(newLoginCount);
            setCurrentLoginDate(today);
            localStorage.setItem('currentLoginDate', today);
            localStorage.setItem('loginCount', newLoginCount.toString());
        }

        const intervalId = setInterval(() => {
            const currentPoints = parseInt(localStorage.getItem('point') || '0');
            setPoints(currentPoints);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const claimReward = (day: number) => {
        if (loginCount >= day && !claimedRewards[day - 1]) {
            const newClaimedRewards = [...claimedRewards];
            newClaimedRewards[day - 1] = true;
            setClaimedRewards(newClaimedRewards);
            localStorage.setItem('claimedLoginRewards', JSON.stringify(newClaimedRewards));

            const reward = day * 100;
            const newPoints = points + reward;
            localStorage.setItem('point', newPoints.toString());
            setPoints(newPoints);
        }
    };

    const loginRewards = [
        { day: 1, reward: 100 },
        { day: 2, reward: 200 },
        { day: 3, reward: 300 },
        { day: 4, reward: 400 },
        { day: 5, reward: 500 },
        { day: 6, reward: 600 },
        { day: 7, reward: 700 },
    ];

    const LoginRewardsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Sự kiện đăng nhập 7 ngày</h2>
                <p className="mb-4">Số ngày đăng nhập: {loginCount}</p>
                <div className="space-y-4 h-[50vh] overflow-y-auto">
                    {loginRewards.map((reward) => (
                        <div key={reward.day} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">Ngày {reward.day}</p>
                                <p className="text-yellow-400">{reward.reward} điểm</p>
                            </div>
                            <button
                                onClick={() => claimReward(reward.day)}
                                className={`px-4 py-2 rounded-lg ${loginCount >= reward.day && !claimedRewards[reward.day - 1]
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : claimedRewards[reward.day - 1]
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-gray-600 cursor-not-allowed'
                                    }`}
                                disabled={loginCount < reward.day || claimedRewards[reward.day - 1]}
                            >
                                <FaGift className="inline mr-2" />
                                {claimedRewards[reward.day - 1] ? 'Đã nhận' : 'Nhận'}
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting/user-center/anistar')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Sự Kiện</h1>
                </div>
                <div className="mb-4 bg-gray-800 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Điểm hiện tại: <span className="text-yellow-400">{points}</span></p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-bold"
                    >
                        Sự kiện đăng nhập 7 ngày
                    </button>
                </div>
            </div>
            {showModal && <LoginRewardsModal />}
        </div>
    );
};

export default EventsPage;