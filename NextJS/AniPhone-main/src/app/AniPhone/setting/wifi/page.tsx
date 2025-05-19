'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { IoWifiOutline, IoRefreshOutline } from "react-icons/io5";

const WifiPage = () => {
    const router = useRouter();
    type WifiPlan = typeof wifiPlans[number];
    const [selectedPlan, setSelectedPlan] = useState<WifiPlan | null>(null);
    const [userBalance, setUserBalance] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<WifiPlan | null>(null);
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [isRenewing, setIsRenewing] = useState(false);
    const [customTime] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTime = window.localStorage.getItem('customTime');
            return savedTime ? new Date(JSON.parse(savedTime)) : new Date(2024, 7, 12, 6, 0);
        }
        return new Date(2024, 7, 12, 6, 0);
    });

    const wifiPlans = [
        { id: 1, name: 'Khởi đầu', speed: '1 Mbps', price: 50000 },
        { id: 2, name: 'Cơ bản', speed: '3 Mbps', price: 250000 },
        { id: 3, name: 'Tiêu chuẩn', speed: '5 Mbps', price: 1000000 },
        { id: 4, name: 'Nâng cao', speed: '10 Mbps', price: 5000000 },
        { id: 5, name: 'Cao cấp', speed: '100 Mbps', price: 100000000 },
    ];

    useEffect(() => {
        const balance = parseInt(window.localStorage.getItem('balance') || '0');
        setUserBalance(balance);
        const savedPlanId = window.localStorage.getItem('wifiPlanId');
        const purchaseDate = window.localStorage.getItem('wifiPlanPurchaseDate');
        if (savedPlanId && purchaseDate) {
            const parsedPlan = wifiPlans.find(plan => plan.id === parseInt(savedPlanId));
            if (parsedPlan) {
                const expirationDate = new Date(purchaseDate);
                expirationDate.setDate(expirationDate.getDate() + 30);
                const remainingDays = Math.ceil((expirationDate.getTime() - customTime.getTime()) / (1000 * 3600 * 24));

                if (remainingDays <= 0) {
                    handleCancelPlan();
                } else {
                    setCurrentPlan(parsedPlan);
                    setDaysRemaining(remainingDays);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customTime]);

    const handleSelectPlan = (plan: WifiPlan) => {
        setSelectedPlan(plan);
        setIsRenewing(false);
        setShowConfirmModal(true);
    };

    const handleConfirmPurchase = () => {
        if (selectedPlan && userBalance >= selectedPlan.price) {
            const newBalance = userBalance - selectedPlan.price;
            const purchaseDate = customTime.toISOString();
            window.localStorage.setItem('balance', newBalance.toString());
            window.localStorage.setItem('wifiPlanId', selectedPlan.id.toString());
            window.localStorage.setItem('wifiPlanPurchaseDate', purchaseDate);
            if (selectedPlan.id === 1) {
                const storedAchievementStatuses = JSON.parse(window.localStorage.getItem('achievementStatuses') || '[]');
                if (storedAchievementStatuses[19] === 0) {
                    storedAchievementStatuses[19] = 1; // Đánh dấu thành tựu đầu tiên đã đạt được
                    window.localStorage.setItem('achievementStatuses', JSON.stringify(storedAchievementStatuses));
                    window.sessionStorage.setItem('AchievementNotification', 'Wifi Khởi Đầu');
                }
            }
            setUserBalance(newBalance);
            setCurrentPlan(selectedPlan);
            setDaysRemaining(30);
            setShowConfirmModal(false);
            setIsRenewing(false);
        }
    };

    const handleRenewPlan = () => {
        if (currentPlan) {
            setSelectedPlan(currentPlan);
            setIsRenewing(true);
            setShowConfirmModal(true);
        }
    };

    const handleCancelPlan = () => {
        window.localStorage.removeItem('wifiPlanId');
        window.localStorage.removeItem('wifiPlanPurchaseDate');
        setCurrentPlan(null);
    };

    const getColorScheme = (index: number) => {
        switch (index) {
            case 0: return { bg: "bg-blue-900", hover: "hover:bg-blue-800", icon: "bg-blue-600", name: "text-blue-300", price: "text-sky-300" };
            case 1: return { bg: "bg-green-900", hover: "hover:bg-green-800", icon: "bg-green-600", name: "text-green-300", price: "text-emerald-300" };
            case 2: return { bg: "bg-purple-900", hover: "hover:bg-purple-800", icon: "bg-purple-600", name: "text-purple-300", price: "text-violet-300" };
            case 3: return { bg: "bg-red-900", hover: "hover:bg-red-800", icon: "bg-red-600", name: "text-red-300", price: "text-rose-300" };
            case 4: return { bg: "bg-yellow-900", hover: "hover:bg-yellow-800", icon: "bg-yellow-600", name: "text-yellow-300", price: "text-amber-300" };
            default: return { bg: "bg-gray-900", hover: "hover:bg-gray-800", icon: "bg-gray-600", name: "text-gray-300", price: "text-gray-300" };
        }
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Wi-Fi</h1>
                </div>
                {currentPlan ? (
                    <div className={`${getColorScheme(currentPlan.id - 1).bg} rounded-lg p-4`}>
                        <h2 className="text-xl font-semibold mb-4">Gói Wi-Fi hiện tại</h2>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className={`font-semibold ${getColorScheme(currentPlan.id - 1).name}`}>{currentPlan.name}</p>
                                <p className="text-sm text-gray-400">Tốc độ: {currentPlan.speed}</p>
                                <p className="text-sm text-gray-400">Còn lại: {daysRemaining} ngày</p>
                            </div>
                            <p className={`font-semibold ${getColorScheme(currentPlan.id - 1).price}`}>{currentPlan.price.toLocaleString()} VND/tháng</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button className={`px-4 py-2 ${getColorScheme(currentPlan.id - 1).icon} rounded flex items-center`} onClick={handleRenewPlan}>
                                <IoRefreshOutline className="mr-2" />
                                Gia hạn
                            </button>
                            <button className="px-4 py-2 bg-red-600 rounded" onClick={handleCancelPlan}>
                                Hủy gói
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wifiPlans.map((plan, index) => {
                            let bgColor, hoverColor, iconColor, nameColor, priceColor;
                            switch (index) {
                                case 0:
                                    bgColor = "bg-blue-900";
                                    hoverColor = "hover:bg-blue-800";
                                    iconColor = "bg-blue-600";
                                    nameColor = "text-blue-300";
                                    priceColor = "text-sky-300";
                                    break;
                                case 1:
                                    bgColor = "bg-green-900";
                                    hoverColor = "hover:bg-green-800";
                                    iconColor = "bg-green-600";
                                    nameColor = "text-green-300";
                                    priceColor = "text-emerald-300";
                                    break;
                                case 2:
                                    bgColor = "bg-purple-900";
                                    hoverColor = "hover:bg-purple-800";
                                    iconColor = "bg-purple-600";
                                    nameColor = "text-purple-300";
                                    priceColor = "text-violet-300";
                                    break;
                                case 3:
                                    bgColor = "bg-red-900";
                                    hoverColor = "hover:bg-red-800";
                                    iconColor = "bg-red-600";
                                    nameColor = "text-red-300";
                                    priceColor = "text-rose-300";
                                    break;
                                case 4:
                                    bgColor = "bg-yellow-900";
                                    hoverColor = "hover:bg-yellow-800";
                                    iconColor = "bg-yellow-600";
                                    nameColor = "text-yellow-300";
                                    priceColor = "text-amber-300";
                                    break;
                                default:
                                    bgColor = "bg-gray-900";
                                    hoverColor = "hover:bg-gray-800";
                                    iconColor = "bg-gray-600";
                                    nameColor = "text-gray-300";
                                    priceColor = "text-gray-300";
                            }
                            return (
                                <div key={index}
                                    className={`mb-3 ${bgColor} rounded-lg p-3 ${hoverColor} transition-all duration-300 cursor-pointer shadow-md`}
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`${iconColor} rounded-full p-2 mr-3 shadow-inner`}>
                                                <IoWifiOutline className="text-lg text-white" />
                                            </div>
                                            <div>
                                                <h2 className={`text-lg font-semibold ${nameColor}`}>{plan.name}</h2>
                                                <p className="text-sm text-gray-400">Tốc độ: <span className="text-green-400">{plan.speed}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${priceColor}`}>{plan.price.toLocaleString()} VND</p>
                                            <p className="text-xs text-gray-400">1 tháng</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mx-4">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {isRenewing ? 'Xác nhận gia hạn' : 'Xác nhận đăng ký'}
                        </h2>
                        {userBalance >= (selectedPlan?.price ?? 0) ? (
                            <>
                                <p>
                                    {isRenewing
                                        ? `Bạn có chắc chắn muốn gia hạn gói ${selectedPlan?.name ?? 'N/A'} với giá ${selectedPlan?.price.toLocaleString() ?? 'N/A'} VND?`
                                        : `Bạn có chắc chắn muốn đăng ký gói ${selectedPlan?.name ?? 'N/A'} với giá ${selectedPlan?.price.toLocaleString() ?? 'N/A'} VND?`}
                                </p>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button className="px-4 py-2 bg-gray-600 rounded" onClick={() => setShowConfirmModal(false)}>Hủy</button>
                                    <button className="px-4 py-2 bg-blue-600 rounded" onClick={handleConfirmPurchase}>
                                        {isRenewing ? 'Gia hạn' : 'Xác nhận'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>Số dư của bạn không đủ để đăng ký gói này. Vui lòng nạp thêm tiền.</p>
                                <div className="mt-4 flex justify-end">
                                    <button className="px-4 py-2 bg-gray-600 rounded" onClick={() => setShowConfirmModal(false)}>Đóng</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WifiPage;
