'use client'
import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from "react-icons/io";
import { LuSmartphone } from "react-icons/lu";
import { RiAppsLine } from "react-icons/ri";
import { FaSimCard, FaUser } from "react-icons/fa";
import { IoWifiOutline } from "react-icons/io5";
import { IoBatteryFullOutline } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';

const SettingsPage = () => {
    const router = useRouter();
    const [AniOS, setAniOS] = useState('1.0');

    useEffect(() => {
        setAniOS(window.localStorage.getItem('AniOS') || '1.0');
    }, []);

    const handleDeviceInfo = () => {
        router.push('/AniPhone/setting/device-info');
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4">
                <div className="flex items-center mb-6">
                    <h1 className="text-3xl font-[600] mx-2">Cài đặt</h1>
                </div>
                <div className="h-[77vh] overflow-y-auto">
                    {parseFloat(AniOS) >= 1.2 && (
                        <>
                            <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => router.push('/AniPhone/setting/wifi')}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#5856D6] rounded-full p-2">
                                            <IoWifiOutline className="text-lg text-white" />
                                        </div>
                                        <span className="text-xl ml-2">Wi-Fi</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                            <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => router.push('/AniPhone/setting/battery')}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#34C759] rounded-full p-2">
                                            <IoBatteryFullOutline className="text-lg text-white" />
                                        </div>
                                        <span className="text-xl ml-2">Pin</span>
                                    </div>
                                    <IoIosArrowForward className="text-lg" />
                                </div>
                            </div>
                        </>
                    )}
                    {
                        parseFloat(AniOS) >= 1.1 && (
                            <>
                                <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => router.push('/AniPhone/setting/apps')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="bg-[#007AFF] rounded-full p-2">
                                                <RiAppsLine className="text-lg text-white" />
                                            </div>
                                            <span className="text-xl ml-2">Ứng dụng</span>
                                        </div>
                                        <IoIosArrowForward className="text-lg" />
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => router.push('/AniPhone/setting/sim')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="bg-[#FF9500] rounded-full p-2">
                                                <FaSimCard className="text-lg text-white" />
                                            </div>
                                            <span className="text-xl ml-2">SIM</span>
                                        </div>
                                        <IoIosArrowForward className="text-lg" />
                                    </div>
                                </div>
                                {parseFloat(AniOS) >= 1.3 && (
                                    <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => router.push('/AniPhone/setting/bank')}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#4CD964] rounded-full p-2">
                                                    <FaUniversity className="text-lg text-white" />
                                                </div>
                                                <span className="text-xl ml-2">Ngân hàng</span>
                                            </div>
                                            <IoIosArrowForward className="text-lg" />
                                        </div>
                                    </div>
                                )}
                                {parseFloat(AniOS) >= 1.4 && (
                                    <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => router.push('/AniPhone/setting/ani-account')}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#FF2D55] rounded-full p-2">
                                                    <FaUserCircle className="text-lg text-white" />
                                                </div>
                                                <span className="text-xl ml-2">Tài khoản Ani</span>
                                            </div>
                                            <IoIosArrowForward className="text-lg" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    }
                    <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => router.push('/AniPhone/setting/wallpaper')}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-[#5856D6] rounded-full p-2">
                                    <IoImageOutline className="text-lg text-white" />
                                </div>
                                <span className="text-xl ml-2">Hình nền</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={handleDeviceInfo}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-[#2fca4b] rounded-full p-2">
                                    <LuSmartphone className="text-lg text-white" />
                                </div>
                                <span className="text-xl ml-2">Giới thiệu về thiết bị</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                    <div className="p-4 hover:bg-gray-800 rounded-lg transition-all duration-300 mb-4">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => router.push('/AniPhone/setting/user-center')}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-[#007AFF] rounded-full p-2">
                                    <FaUser className="text-lg text-white" />
                                </div>
                                <span className="text-xl ml-2">Trung tâm người dùng</span>
                            </div>
                            <IoIosArrowForward className="text-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;