'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const AppPage = () => {
    const router = useRouter();
    const [displayUrl] = useState('');
    const [apps] = useState([
        { name: 'LinkGO', url: '/AniPhone/browser/app/linkgo', icon: 'L' },
        { name: 'CrazyNumber', url: '/AniPhone/browser/app/crazynumber', icon: 'C' },
        { name: 'Tic-Tac-Toe Online', url: '/AniPhone/browser/app/tictactoe', icon: 'T' },
        { name: 'AdClicker', url: '/AniPhone/browser/app/adclicker', icon: 'A' },
        { name: 'SurveyPay', url: '/AniPhone/browser/app/surveypay', icon: 'S' },

    ]);
    const [hasWifi, setHasWifi] = useState(false);

    useEffect(() => {
        const wifiPlanId = window.localStorage.getItem('wifiPlanId');
        setHasWifi(!!wifiPlanId);
        const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
        if (storedAchievementStatuses[17] === 0) {
            storedAchievementStatuses[17] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
            window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
            window.sessionStorage.setItem('AchievementNotification', 'Truy Cập Web App');
        }
    }, []);

    const switchToBrowser = () => {
        router.push('/AniPhone/browser');
    };

    const openApp = (url: string) => {
        if (hasWifi) {
            router.push(url);
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <Nav />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center mb-4">
                    <FaExchangeAlt className="text-xl cursor-pointer mr-4" onClick={switchToBrowser} />
                    <div className="flex-grow flex items-center bg-gray-800 rounded-lg p-2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={displayUrl}
                            placeholder="Tìm kiếm ứng dụng..."
                            className="bg-transparent flex-grow outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex-grow bg-gray-900 rounded-lg p-4 mb-6 overflow-y-auto">
                    {hasWifi ? (
                        <>
                            <h2 className="text-xl font-bold mb-4">Ứng dụng</h2>
                            <div className="space-y-3">
                                {apps.map((app, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300"
                                        onClick={() => openApp(app.url)}
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                                            {app.icon}
                                        </div>
                                        <p className="text-lg">{app.name}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Không có kết nối WiFi. Vui lòng kết nối WiFi để sử dụng ứng dụng.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppPage;