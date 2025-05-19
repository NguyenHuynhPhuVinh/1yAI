'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaExchangeAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const BrowserPage = () => {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [hasWifi, setHasWifi] = useState(false);
    const [displayUrl, setDisplayUrl] = useState('');
    const [showSwitchIcon, setShowSwitchIcon] = useState(false);

    useEffect(() => {
        const wifiPlanId = window.localStorage.getItem('wifiPlanId');
        setHasWifi(!!wifiPlanId);

        const aniOSVersion = window.localStorage.getItem('AniOS');
        if (aniOSVersion && parseFloat(aniOSVersion) >= 1.3) {
            setShowSwitchIcon(true);
        }
    }, []);

    const handleSearch = (newUrl: string) => {
        if (newUrl && hasWifi) {
            let finalUrl = newUrl;
            setDisplayUrl(newUrl);
            if (newUrl === 'aniw://doctruyenkiemtien.ani') {
                finalUrl = 'https://tomisakae.github.io/AniPhone/browser/custom/doctruyen';
                //finalUrl = 'http://localhost:3000/AniPhone/browser/custom/doctruyen';
            }
            if (newUrl === 'aniw://khaosatkiemtien.ani') {
                finalUrl = 'https://tomisakae.github.io/AniPhone/browser/custom/khaosat';
                //finalUrl = 'http://localhost:3000/AniPhone/browser/custom/khaosat';
            }
            if (newUrl === 'aniw://xemquangcaokiemtien.ani') {
                finalUrl = 'https://tomisakae.github.io/AniPhone/browser/custom/xemquangcao';
                //finalUrl = 'http://localhost:3000/AniPhone/browser/custom/xemquangcao';
            }
            if (newUrl === 'aniw://choigamekiemtien.ani') {
                finalUrl = 'https://tomisakae.github.io/AniPhone/browser/custom/choigame';
                //finalUrl = 'http://localhost:3000/AniPhone/browser/custom/choigame';
            }
            if (newUrl === 'aniw://gachakiemtien.ani') {
                finalUrl = 'https://tomisakae.github.io/AniPhone/browser/custom/gachakiemtien';
                //finalUrl = 'http://localhost:3000/AniPhone/browser/custom/gachakiemtien';
            }
            setUrl(finalUrl);
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
                    {showSwitchIcon && (
                        <FaExchangeAlt className="text-xl cursor-pointer mr-4" onClick={switchToWebApp} />
                    )}
                    <div className="flex-grow flex items-center bg-gray-800 rounded-lg p-2">
                        <FaSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={displayUrl}
                            onChange={(e) => {
                                setDisplayUrl(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            placeholder="Nhập URL hoặc tìm kiếm..."
                            className="bg-transparent flex-grow outline-none"
                            disabled={!hasWifi}
                        />
                    </div>
                </div>
                <div className="flex-grow bg-gray-900 rounded-lg p-4 mb-6">
                    {!hasWifi ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Không có kết nối WiFi. Vui lòng kết nối WiFi để duyệt web
                        </div>
                    ) : url ? (
                        <iframe
                            key={url}
                            src={url}
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Nhập URL để bắt đầu duyệt web
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowserPage;
