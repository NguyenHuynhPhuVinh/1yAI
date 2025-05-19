'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaBatteryFull, FaPlug } from 'react-icons/fa';

const BatteryPage = () => {
    const router = useRouter();
    const [batteryPercentage, setBatteryPercentage] = useState(100);
    const [remainingTime, setRemainingTime] = useState('');
    const [isCharging, setIsCharging] = useState(false);
    const [batteryDrainRate, setBatteryDrainRate] = useState(6); // Mặc định 60 giây

    useEffect(() => {
        const storedBattery = window.localStorage.getItem('batteryPercentage');
        if (storedBattery) {
            setBatteryPercentage(parseInt(storedBattery));
        }

        const storedDrainRate = window.localStorage.getItem('batteryDrainRate');
        if (storedDrainRate) {
            setBatteryDrainRate(parseFloat(storedDrainRate));
        }

        // Tính thời gian sử dụng còn lại dựa trên batteryDrainRate
        const remainingSeconds = batteryPercentage * batteryDrainRate;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        setRemainingTime(`${hours}h ${minutes}m`);

        const interval = setInterval(() => {
            const updatedBattery = window.localStorage.getItem('batteryPercentage');
            if (updatedBattery) {
                setBatteryPercentage(parseInt(updatedBattery));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [batteryPercentage, batteryDrainRate]);

    const handleCharge = () => {
        setIsCharging(true);
        const chargingInterval = setInterval(() => {
            setBatteryPercentage(prev => {
                if (prev >= 100) {
                    clearInterval(chargingInterval);
                    setIsCharging(false);
                    window.localStorage.setItem('batteryPercentage', '100');
                    return 100;
                }
                const newPercentage = prev + 1;
                window.localStorage.setItem('batteryPercentage', newPercentage.toString());
                return newPercentage;
            });
        }, 1000); // Thay đổi từ 100 thành 1000 để sạc 1% mỗi giây
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Pin</h1>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-8">
                        <FaBatteryFull className={`text-9xl ${batteryPercentage < 20 ? 'text-red-500' : 'text-green-500'}`} />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-black">
                            {batteryPercentage}%
                        </span>
                    </div>
                    <p className="text-2xl mb-8 text-center">
                        Thời gian sử dụng còn lại: <br />
                        <span className="font-bold text-3xl">{remainingTime}</span>
                    </p>
                    <button
                        onClick={handleCharge}
                        disabled={isCharging || batteryPercentage === 100}
                        className={`flex items-center justify-center px-8 py-4 rounded-full text-xl font-semibold
                            ${isCharging || batteryPercentage === 100
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                            } transition duration-300 shadow-lg`}
                    >
                        <FaPlug className="mr-3 text-2xl" />
                        {isCharging ? 'Đang sạc...' : 'Sạc pin'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatteryPage;
