'use client'

import React, { useState, useEffect } from 'react';
import { FaCheck, FaGift, FaTimes } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';

const MissionsPage = () => {
    const router = useRouter();
    const missionsList = [
        { id: 1, name: 'Giao việc cho nhân vật', reward: 50 },
        { id: 2, name: 'Xa thải 1 nhân vật', reward: 50 },
        { id: 3, name: 'Nâng cấp 1 nhân vật', reward: 100 },
        { id: 4, name: 'Thực hiện 1 lần gacha', reward: 100 },
    ];

    const [missionStatuses, setMissionStatuses] = useState<number[]>([]);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const storedStatuses = localStorage.getItem('dailyMissions');
        const lastResetDate = localStorage.getItem('lastMissionResetDate');
        const today = new Date().toDateString();

        if (storedStatuses && lastResetDate === today) {
            setMissionStatuses(JSON.parse(storedStatuses));
        } else {
            // Reset missions
            const resetStatuses = new Array(missionsList.length).fill(0);
            setMissionStatuses(resetStatuses);
            localStorage.setItem('dailyMissions', JSON.stringify(resetStatuses));
            localStorage.setItem('lastMissionResetDate', today);
        }

        // Update points every second
        const intervalId = setInterval(() => {
            const currentPoints = parseInt(localStorage.getItem('point') || '0');
            setPoints(currentPoints);
        }, 1000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const completeMission = (id: number) => {
        const updatedStatuses = [...missionStatuses];
        const missionIndex = id - 1;

        if (updatedStatuses[missionIndex] === 0) {
            updatedStatuses[missionIndex] = 1;
        } else if (updatedStatuses[missionIndex] === 1) {
            updatedStatuses[missionIndex] = 2;
            // Add points to user's account
            const mission = missionsList[missionIndex];
            const newPoints = points + mission.reward;
            localStorage.setItem('point', newPoints.toString());
            setPoints(newPoints);
        }

        setMissionStatuses(updatedStatuses);
        localStorage.setItem('dailyMissions', JSON.stringify(updatedStatuses));
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting/user-center/anistar')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Nhiệm Vụ Hàng Ngày</h1>
                </div>
                <div className="mb-4 bg-gray-800 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Điểm hiện tại: <span className="text-yellow-400">{points}</span></p>
                </div>
                <div className="space-y-4">
                    {missionsList.map((mission, index) => (
                        <div key={mission.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{mission.name}</h2>
                                <p className="text-sm text-gray-400">Phần thưởng: {mission.reward} điểm</p>
                            </div>
                            {missionStatuses[index] === 0 && (
                                <span className="text-gray-500 flex items-center gap-2 mx-2">
                                    <FaTimes className='text-red-500' />
                                </span>
                            )}
                            {missionStatuses[index] === 1 && (
                                <button
                                    onClick={() => completeMission(mission.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center gap-1 text-sm mx-2"
                                >
                                    <FaGift /> {mission.reward}P
                                </button>
                            )}
                            {missionStatuses[index] === 2 && (
                                <span className="text-green-500 flex items-center gap-2 mx-2">
                                    <FaCheck />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MissionsPage;
