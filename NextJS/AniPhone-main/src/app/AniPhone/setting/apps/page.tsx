'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AppsPage = () => {
    const router = useRouter();
    const [apps, setApps] = useState([
        { name: 'AniOS', icon: null, size: '228 MB' },
        { name: 'Cài đặt', icon: '/setting.webp', size: '12 MB' },
        { name: 'Tin nhắn', icon: '/mes.webp', size: '10 MB' },
    ]);

    useEffect(() => {
        const aniosVersion = window.localStorage.getItem('AniOS');

        setApps(prevApps => {
            const updatedApps = prevApps.map(app => {
                if (app.name === 'AniOS') {
                    return {
                        ...app,
                        size: aniosVersion === '1.1' ? '228 MB' : '258 MB'
                    };
                }
                return app;
            });

            // Kiểm tra xem trình duyệt đã tồn tại chưa
            const browserExists = updatedApps.some(app => app.name === 'Trình duyệt');

            // Thêm hoặc cập nhật ứng dụng trình duyệt
            if (aniosVersion && parseFloat(aniosVersion) >= 1.2) {
                if (browserExists) {
                    return updatedApps.map(app => {
                        if (app.name === 'Trình duyệt') {
                            return {
                                ...app,
                                size: parseFloat(aniosVersion) >= 1.3 ? '70 MB' : '20 MB'
                            };
                        }
                        return app;
                    });
                } else {
                    updatedApps.push({
                        name: 'Trình duyệt',
                        icon: '/browser.webp',
                        size: parseFloat(aniosVersion) >= 1.3 ? '70 MB' : '20 MB'
                    });
                }
            }

            return updatedApps;
        });
    }, []);

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Ứng dụng</h1>
                </div>
                <div className="space-y-4">
                    {apps.map((app, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300">
                            <div className="flex items-center">
                                {app.icon ? (
                                    <Image src={app.icon} alt={app.name} width={48} height={48} className="mr-4 rounded-xl" />
                                ) : (
                                    <div className="w-12 h-12 mr-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">
                                        {app.name[0]}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">{app.name}</span>
                                    <span className="text-sm text-gray-400">{app.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppsPage;
