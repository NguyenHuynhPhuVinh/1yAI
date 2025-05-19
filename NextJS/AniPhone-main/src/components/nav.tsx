import { LiaBatteryFullSolid, LiaBatteryThreeQuartersSolid, LiaBatteryHalfSolid, LiaBatteryQuarterSolid, LiaBatteryEmptySolid } from "react-icons/lia";
import { FaRegSquare, FaTrophy } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { RiPlayReverseLargeLine } from "react-icons/ri";
import { useRouter, usePathname } from 'next/navigation';
import { BiSignal5 } from "react-icons/bi";
import { useEffect, useState, useCallback } from "react";
import { IoWifiOutline } from "react-icons/io5";
import ActiveAppsManager from './ActiveAppsManager';
import Image from 'next/image';
import TotalPointsPerSecond from "./TotalPointsPerSecond";

const Nav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isAniPhone = pathname === '/AniPhone';
    const [isSignal, setIsSignal] = useState(false);
    const [batteryPercentage, setBatteryPercentage] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(window.localStorage.getItem('batteryPercentage') || '100');
        }
        return 100;
    });
    const [usageDuration, setUsageDuration] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(window.localStorage.getItem('usageDuration') || '0');
        }
        return 0;
    });
    const [showLowBatteryModal, setShowLowBatteryModal] = useState(false);
    const [hasWifi, setHasWifi] = useState(false);
    const [customTime, setCustomTime] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTime = window.localStorage.getItem('customTime');
            return savedTime ? new Date(JSON.parse(savedTime)) : new Date(2024, 7, 12, 6, 0);
        }
        return new Date(2024, 7, 12, 6, 0);
    });
    const [batteryDrainRate, setBatteryDrainRate] = useState(6); // Tốc độ giảm pin (% mỗi giây)
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showAchievementNotification, setShowAchievementNotification] = useState(false);
    const [achievementMessage, setAchievementMessage] = useState('');

    const updateCustomTime = useCallback((minutes: number, currentTime?: Date) => {
        setCustomTime(prevTime => {
            const newTime = new Date(currentTime || prevTime);
            newTime.setMinutes(newTime.getMinutes() + minutes);

            // Xử lý tăng ngày, tháng, năm, và thứ
            const daysPassed = Math.floor(minutes / (24 * 60));
            if (daysPassed > 0) {
                const newDate = new Date(prevTime.getTime() + daysPassed * 24 * 60 * 60 * 1000);
                newTime.setDate(newDate.getDate());
                newTime.setMonth(newDate.getMonth());
                newTime.setFullYear(newDate.getFullYear());
            }

            if (typeof window !== 'undefined') {
                window.localStorage.setItem('customTime', JSON.stringify(newTime));
            }
            return newTime;
        });
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
            if (storedStatuses.length < 24) {
                const initialStatuses = [...storedStatuses, ...new Array(24 - storedStatuses.length).fill(0)];
                window.localStorage.setItem('achievementStatuses', JSON.stringify(initialStatuses));
            }
            const storedStatuses2 = JSON.parse(localStorage.getItem('inboxMessageStatuses') || '[]');
            if (storedStatuses2.length < 1) {
                const initialStatuses2 = [...storedStatuses2, ...new Array(1 - storedStatuses2.length).fill(0)];
                window.localStorage.setItem('inboxMessageStatuses', JSON.stringify(initialStatuses2));
            }
            const storedStatuses3 = JSON.parse(localStorage.getItem('usedGiftCodes') || '[]');
            if (storedStatuses3.length < 3) {
                const initialStatuses3 = [...storedStatuses3, ...new Array(3 - storedStatuses3.length).fill(0)];
                window.localStorage.setItem('usedGiftCodes', JSON.stringify(initialStatuses3));
            }
            const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
            if (storedJobs.length < 14) {
                const initialJobs = [...storedJobs, ...new Array(14 - storedJobs.length).fill(-1)];
                localStorage.setItem('jobs', JSON.stringify(initialJobs));
            }
        }
    }, []);

    useEffect(() => {
        if (window.localStorage.getItem('phoneNumber') !== null) {
            setIsSignal(true);
        }
        // Start tracking usage time and updating battery
        const interval = setInterval(() => {

            // Load battery drain rate from localStorage
            const storedDrainRate = window.localStorage.getItem('batteryDrainRate');
            const batteryDrainRate = storedDrainRate ? parseFloat(storedDrainRate) : 60; // Default to 60 seconds if not set
            setBatteryDrainRate(batteryDrainRate);
            setBatteryPercentage(parseInt(window.localStorage.getItem('batteryPercentage') || '100'));

            setUsageDuration(prevDuration => {
                const newDuration = prevDuration + 1;
                window.localStorage.setItem('usageDuration', newDuration.toString());
                return newDuration;
            });

            setBatteryPercentage(prevBattery => {
                // Giảm pin 1% mỗi batteryDrainRate giây
                if (prevBattery > 0 && usageDuration % batteryDrainRate === 0) {
                    const newBattery = prevBattery - 1;
                    window.localStorage.setItem('batteryPercentage', newBattery.toString());

                    // Kiểm tra nếu pin còn 5% thì hiện modal
                    if (newBattery === 5) {
                        setShowLowBatteryModal(true);
                    }

                    // Thêm điều kiện để chuyển hướng khi pin 0%
                    if (newBattery === 0) {
                        router.push('/shutdown');
                    }

                    return newBattery;
                }
                return prevBattery;
            });
        }, 1000); // Update every second

        // Add custom time tracking
        const timeInterval = setInterval(() => {
            if (typeof window !== 'undefined') {
                const savedTime = window.localStorage.getItem('customTime');
                if (savedTime) {
                    const currentTime = new Date(JSON.parse(savedTime));
                    updateCustomTime(1, currentTime); // Pass the current time from localStorage
                } else {
                    updateCustomTime(1); // Use the existing state if no saved time
                }
            }
        }, 1000);

        // Check for wifiPlanId and expiration
        const checkWifiPlan = () => {
            const savedPlanId = window.localStorage.getItem('wifiPlanId');
            const purchaseDate = window.localStorage.getItem('wifiPlanPurchaseDate');
            if (savedPlanId && purchaseDate) {
                const expirationDate = new Date(purchaseDate);
                expirationDate.setDate(expirationDate.getDate() + 30);
                const remainingDays = Math.ceil((expirationDate.getTime() - customTime.getTime()) / (1000 * 3600 * 24));

                if (remainingDays <= 0) {
                    // Plan has expired, cancel it
                    window.localStorage.removeItem('wifiPlanId');
                    window.localStorage.removeItem('wifiPlanPurchaseDate');
                    setHasWifi(false);
                } else {
                    setHasWifi(true);
                }
            } else {
                setHasWifi(false);
            }
        };

        checkWifiPlan();
        const wifiCheckInterval = setInterval(checkWifiPlan, 60000); // Check every minute

        const checkNotifications = () => {
            const notification = window.sessionStorage.getItem('Notification');
            if (notification) {
                setNotificationMessage(notification);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                window.sessionStorage.removeItem('Notification');
            }

            const achievementNotification = window.sessionStorage.getItem('AchievementNotification');
            if (achievementNotification) {
                setAchievementMessage(achievementNotification);
                setShowAchievementNotification(true);
                setTimeout(() => setShowAchievementNotification(false), 3000);
                window.sessionStorage.removeItem('AchievementNotification');
            }
        };

        const notificationInterval = setInterval(checkNotifications, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(wifiCheckInterval);
            clearInterval(timeInterval);
            clearInterval(notificationInterval);
        };
    }, [usageDuration, router, updateCustomTime, customTime, batteryDrainRate, showLowBatteryModal]);

    const getBatteryIcon = () => {
        const iconClass = batteryPercentage <= 20 ? 'text-red-500' : '';
        if (batteryPercentage > 75) return <LiaBatteryFullSolid className={`mr-1 mt-[2px] text-2xl ${iconClass}`} />;
        if (batteryPercentage > 50) return <LiaBatteryThreeQuartersSolid className={`mr-1 mt-[2px] text-2xl ${iconClass}`} />;
        if (batteryPercentage > 25) return <LiaBatteryHalfSolid className={`mr-1 mt-[2px] text-2xl ${iconClass}`} />;
        if (batteryPercentage > 10) return <LiaBatteryQuarterSolid className={`mr-1 mt-[2px] text-2xl ${iconClass}`} />;
        return <LiaBatteryEmptySolid className={`mr-1 mt-[2px] text-2xl ${iconClass}`} />;
    };

    const formatCustomTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleBackNavigation = useCallback(() => {
        if (isAniPhone) return; // Don't navigate back if on AniPhone main screen

        const pathParts = pathname.split('/').filter(Boolean);

        if (pathname === '/menu') {
            // If we're on /menu, go back to /AniPhone
            router.push('/AniPhone');
        } else if (pathParts.length > 1) {
            // Remove the last part of the path
            const parentPath = '/' + pathParts.slice(0, -1).join('/');
            router.push(parentPath);
        } else {
            // If we're already at a top-level route, go to /menu
            router.push('/menu');
        }
    }, [router, pathname, isAniPhone]);

    return (
        <>
            <ActiveAppsManager />
            <div className='flex justify-between items-center text-white mx-4 pt-1'>
                <div className='flex items-center'>
                    <div className='text-md'>
                        {formatCustomTime(customTime)}
                    </div>
                    <div className="mx-4">
                        <span className="text-yellow-400"><TotalPointsPerSecond /></span>
                    </div>
                </div>
                <div className='flex items-center'>
                    {hasWifi && (
                        <IoWifiOutline className='mr-1 text-xl' />
                    )}
                    {isSignal && (
                        <BiSignal5 className='mr-1 text-xl' />
                    )}
                    {getBatteryIcon()}
                    <span className={batteryPercentage <= 20 ? 'text-red-500' : ''}>{batteryPercentage}%</span>
                </div>
            </div>
            <div className='absolute bottom-0 left-0 right-0 flex justify-between items-center text-white pb-1 mx-6'>
                <div className='flex-1 flex justify-center p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20 transition-all duration-300'
                    onClick={() => router.push('/menu')}
                >
                    <div className='flex flex-col items-center'>
                        <CiMenuBurger className='text-md' />
                    </div>
                </div>
                <div className='flex-1 flex justify-center p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20 transition-all duration-300'
                    onClick={() => router.push('/AniPhone')}
                >
                    <div className='flex flex-col items-center'>
                        <FaRegSquare className='text-md' />
                    </div>
                </div>
                <div className="flex-1 flex justify-center p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20 transition-all duration-300"
                    onClick={handleBackNavigation}
                >
                    <div className='flex flex-col items-center'>
                        <RiPlayReverseLargeLine className='text-lg' />
                    </div>
                </div>
            </div>
            {showLowBatteryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg text-white">
                        <h2 className="text-xl font-bold mb-4">Cảnh báo pin yếu</h2>
                        <p className="mb-4">Pin của bạn còn 5%. Vui lòng sạc pin ngay.</p>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
                            onClick={() => setShowLowBatteryModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {showNotification && (
                <div className="fixed top-10 left-0 right-0 bg-white text-black px-4 py-3 shadow-lg z-50 animate-fade-in-down flex items-center h-[10vh] z-[9999]">
                    <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                        <Image
                            src="/mes.webp"
                            alt="Message icon"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">Thông báo</p>
                        <p className="text-xs text-gray-600">{notificationMessage}</p>
                    </div>
                </div>
            )}
            {showAchievementNotification && (
                <div className="fixed top-10 left-0 right-0 bg-white text-black px-4 py-3 shadow-lg z-50 animate-fade-in-down flex items-center h-[10vh] z-[9999]">
                    <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-yellow-500 flex items-center justify-center">
                        <FaTrophy className="text-2xl text-white" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm">Bạn vừa đạt thành tựu <span className="text-yellow-500">{achievementMessage}</span></p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Nav;