'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const DeviceInfoPage = () => {
    const router = useRouter();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdateComplete, setIsUpdateComplete] = useState(false);
    const [AniOS, setAniOS] = useState("1.0");
    const [textAniOS, setTextAniOS] = useState("Đang kiểm tra phiên bản...");
    const [ROM, setROM] = useState("250");
    const [ROMused, setROMused] = useState("233");
    const [textROM, setTextROM] = useState("Đang kiểm tra...");
    const [RAM, setRAM] = useState("100");
    const [textRAM, setTextRAM] = useState("Đang kiểm tra...");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userBalance, setUserBalance] = useState(0);

    const handleDeleteData = () => {
        setShowDeleteModal(false);
        if (typeof window !== 'undefined') {
            window.localStorage.clear();
            window.sessionStorage.clear();
            router.push('/');
        }
    };

    const startUpdate = () => {
        const updateInfo = getUpdateInfo();
        if (!updateInfo) return;

        const balance = parseInt(window.localStorage.getItem('balance') || '0');
        if (balance < updateInfo.fee) {
            return;
        }

        setIsUpdating(true);
        setTimeout(() => {
            const newBalance = balance - updateInfo.fee;
            window.localStorage.setItem('balance', newBalance.toString());
            setIsUpdating(false);
            setIsUpdateComplete(true);
        }, 3000);
    };

    const handleRestart = () => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem('backgroundImageUrl');
            const currentVersion = window.localStorage.getItem('AniOS') || '1.0';
            const updates: Record<string, { AniOS: string; ROM: string; RAM: string; ROMused: string; batteryDrainRate?: string }> = {
                '1.0': {
                    AniOS: '1.1',
                    ROM: '350',
                    RAM: '150',
                    ROMused: '250'
                },
                '1.1': {
                    AniOS: '1.2',
                    ROM: '500',
                    RAM: '200',
                    ROMused: '300'
                },
                '1.2': {
                    AniOS: '1.3',
                    ROM: '1000',
                    RAM: '500',
                    ROMused: '350',
                    batteryDrainRate: '12' // Thêm batteryDrainRate cho phiên bản 1.3
                },
                '1.3': {
                    AniOS: '1.4',
                    ROM: '2000',
                    RAM: '1000',
                    ROMused: '500',
                    batteryDrainRate: '24'
                }
            };

            if (currentVersion in updates) {
                Object.entries(updates[currentVersion as keyof typeof updates]).forEach(([key, value]) => {
                    window.localStorage.setItem(key, value.toString());
                });
            }
            if (currentVersion === '1.0') {
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[2] === 0) {
                    storedAchievementStatuses[2] = 1; // Đánh dấu thành tựu thứ hai đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Hệ Điều Hành 1.1');
                }
            } else if (currentVersion === '1.1') {
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[3] === 0) {
                    storedAchievementStatuses[3] = 1; // Đánh dấu thành tựu thứ ba đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Hệ Điều Hành 1.2');
                }
            } else if (currentVersion === '1.2') {
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[4] === 0) {
                    storedAchievementStatuses[4] = 1; // Đánh dấu thành tựu thứ tư đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Hệ Điều Hành 1.3');
                }
            }
        }
        router.push('/AniPhone');
    };

    const handleUpdate = () => {
        setShowUpdateModal(true);
    };

    const closeModal = () => {
        setShowUpdateModal(false);
    };

    useEffect(() => {
        setAniOS(window.localStorage.getItem('AniOS') || '1.0');
        setROM(window.localStorage.getItem('ROM') || '250');
        setRAM(window.localStorage.getItem('RAM') || '100');
        setROMused(window.localStorage.getItem('ROMused') || '233');
        const balance = parseInt(window.localStorage.getItem('balance') || '0');
        setUserBalance(balance);
    }, []);

    useEffect(() => {
        setTextAniOS(`AniOS ${AniOS}`);
        setTextROM(`${formatStorage(ROMused)}/${formatStorage(ROM)}`);
        setTextRAM(formatStorage(RAM));
    }, [AniOS, ROM, RAM, ROMused]);

    const formatStorage = (value: string) => {
        const numValue = parseInt(value);
        if (numValue >= 1000) {
            return `${(numValue / 1000).toFixed(2)} GB`;
        }
        return `${numValue} MB`;
    };

    const getUpdateInfo = () => {
        const currentVersion = AniOS as '1.0' | '1.1' | '1.2' | '1.3';
        const updateInfo: Record<'1.0' | '1.1' | '1.2' | '1.3', { version: string; features: string[]; fee: number }> = {
            '1.0': {
                version: '1.1',
                features: [
                    'Thêm hệ thống sim',
                    'Thêm ứng dụng Tin nhắn',
                    'Thêm hệ thống ứng dụng',
                    'Tăng thêm 100 MB dung lượng',
                    'Tăng thêm 50 MB RAM'
                ],
                fee: 0
            },
            '1.1': {
                version: '1.2',
                features: [
                    'Thêm hệ thống wifi',
                    'Thêm ứng dụng Trình duyệt',
                    'Thêm hệ thống pin',
                    'Tăng thêm 150 MB dung lượng',
                    'Tăng thêm 50 MB RAM'
                ],
                fee: 100000
            },
            '1.2': {
                version: '1.3',
                features: [
                    'Thêm hệ thống Ngân hàng',
                    'Thêm tính năng web app cho Trình duyệt',
                    'Tăng thời gian sử dụng pin',
                    'Tăng thêm 500 MB dung lượng',
                    'Tăng thêm 300 MB RAM'
                ],
                fee: 250000
            },
            '1.3': {
                version: '1.4',
                features: [
                    'Thêm hệ thống tài khoản Ani',
                    'Thêm các ứng dụng mới!',
                    'Tăng thời gian sử dụng pin',
                    'Tăng thêm 1 GB dung lượng',
                    'Tăng thêm 500 MB RAM'
                ],
                fee: 500000
            }
        };
        return updateInfo[currentVersion] || null;
    };

    const isSufficientBalance = () => {
        const updateInfo = getUpdateInfo();
        return updateInfo ? userBalance >= updateInfo.fee : false;
    };

    const handleUpdateButtonClick = () => {
        const updateInfo = getUpdateInfo();
        if (!updateInfo) {
            closeModal();
        } else if (isSufficientBalance()) {
            startUpdate();
        }
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Giới thiệu về thiết bị</h1>
                </div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 mx-4">
                <h2 className="text-lg font-[500]">Phiên Bản</h2>
                <p className="text-md text-gray-300">{textAniOS}</p>
                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
                    onClick={handleUpdate}
                >
                    Cập Nhật
                </button>
            </div>
            <div className="flex justify-between gap-4 mx-4">
                <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 flex-1">
                    <h2 className="text-lg font-[500]">Tên thiết bị</h2>
                    <p className="text-sm text-gray-300">AniPhone</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 flex-1">
                    <h2 className="text-lg font-[500]">Bộ nhớ</h2>
                    <p className="text-sm text-gray-300">Đã sử dụng</p>
                    <p className="text-sm text-gray-300">{textROM}</p>
                </div>
            </div>
            <div className="flex justify-between gap-4 mx-4">
                <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 flex-1">
                    <h2 className="text-lg font-[500]">Bộ xử lý</h2>
                    <p className="text-sm text-gray-300">AniCore 1</p>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 flex-1">
                    <h2 className="text-lg font-[500]">RAM</h2>
                    <p className="text-sm text-gray-300">{textRAM}</p>
                </div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl my-4 mx-4">
                <h2 className="text-lg font-[500] mb-2">Xóa dữ liệu</h2>
                <button
                    className="bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold py-2 px-4 transition duration-300"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Xóa tất cả dữ liệu
                </button>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center mx-4">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-center">Xác nhận xóa dữ liệu</h2>
                        <p className="mb-6 text-lg text-center">Bạn có chắc chắn muốn xóa tất cả dữ liệu không?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                onClick={handleDeleteData}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center mx-4">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-center">Cập Nhật Phần Mềm</h2>
                        {!isUpdating && !isUpdateComplete ? (
                            <>
                                {getUpdateInfo() ? (
                                    <>
                                        <p className="mb-4 text-lg font-semibold">Phiên bản AniOS {getUpdateInfo().version}:</p>
                                        <ul className="mb-6 text-sm space-y-2">
                                            {getUpdateInfo().features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <span className="mr-2 text-green-500">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className={`mb-6 text-lg font-bold text-center ${isSufficientBalance() ? 'text-green-500' : 'text-red-500'}`}>
                                            Phí cập nhật: {getUpdateInfo().fee.toLocaleString()}đ
                                        </p>
                                    </>
                                ) : (
                                    <p className="mb-6 text-lg text-center">Không có bản cập nhật mới.</p>
                                )}
                            </>
                        ) : (
                            <p className="mb-4 text-lg font-semibold text-center">Phiên bản AniOS {getUpdateInfo()?.version}</p>
                        )}
                        <div className="flex justify-center space-x-4">
                            {!isUpdating && !isUpdateComplete && (
                                <>
                                    {getUpdateInfo() ? (
                                        <>
                                            <button
                                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                                onClick={closeModal}
                                            >
                                                Hủy
                                            </button>
                                            {isSufficientBalance() && (
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                                    onClick={handleUpdateButtonClick}
                                                >
                                                    Xác nhận
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                            onClick={closeModal}
                                        >
                                            Đóng
                                        </button>
                                    )}
                                </>
                            )}
                            {isUpdating && (
                                <div className="text-center">
                                    <p className="mb-4">Đang cập nhật...</p>
                                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                                </div>
                            )}
                            {isUpdateComplete && (
                                <div className="text-center">
                                    <p className="mb-4 text-green-500 font-bold">Cập nhật thành công!</p>
                                    <button
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                                        onClick={handleRestart}
                                    >
                                        Khởi động lại
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceInfoPage;
