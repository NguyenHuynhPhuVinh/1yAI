'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import Image from 'next/image';
import { IoCloseCircle } from 'react-icons/io5';

interface App {
    id: string;
    name: string;
    url: string;
}

export default function MenuPage() {
    const [activeApps, setActiveApps] = useState<App[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedApps = window.sessionStorage.getItem('activeApps');
        if (storedApps) {
            const parsedApps = JSON.parse(storedApps);
            const filteredApps = parsedApps.filter((app: App) => app.id !== 'home');
            setActiveApps(filteredApps);
        }
    }, []);

    const removeActiveApp = (appId: string) => {
        const updatedApps = activeApps.filter(app => app.id !== appId);
        setActiveApps(updatedApps);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('activeApps', JSON.stringify(updatedApps));
        }
    };

    const navigateToApp = (url: string) => {
        router.push(url);
    };

    const getAppIcon = (appId: string) => {
        switch (appId) {
            case 'setting':
                return '/setting.webp';
            case 'browser':
                return '/browser.webp';
            case 'mes':
                return '/mes.webp';
            default:
                return '/home.webp';
        }
    };

    const closeAllApps = () => {
        setActiveApps([]);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('activeApps', JSON.stringify([]));
        }
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Nav />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Ứng dụng đang chạy</h2>
                    <button
                        onClick={closeAllApps}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-[500] px-4 py-2 rounded-full"
                    >
                        Đóng tất cả
                    </button>
                </div>
                <div className="space-y-4">
                    {activeApps.map(app => (
                        <div key={app.id} className="bg-gray-800 rounded-lg p-4 relative">
                            <div className="flex items-center">
                                <div
                                    className="flex items-center cursor-pointer flex-grow"
                                    onClick={() => navigateToApp(app.url)}
                                >
                                    <Image
                                        src={getAppIcon(app.id)}
                                        alt={app.name}
                                        width={48}
                                        height={48}
                                        className="mr-4 rounded-lg"
                                    />
                                    <span>{app.name}</span>
                                </div>
                                <button
                                    onClick={() => removeActiveApp(app.id)}
                                    className="text-red-500 hover:text-red-600 ml-4"
                                >
                                    <IoCloseCircle size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
