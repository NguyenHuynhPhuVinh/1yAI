'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaSort } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { Character, charactersData } from '@/components/CharactersData';
import { FaArrowUp } from 'react-icons/fa';

const IdolGallery = () => {
    const [idols, setIdols] = useState<(Character & { level: number, currentSpeed: number })[]>([]);
    const [selectedIdol, setSelectedIdol] = useState<(Character & { level: number, currentSpeed: number }) | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [points, setPoints] = useState(0);
    const [sortBy, setSortBy] = useState('rarity');
    const router = useRouter();

    useEffect(() => {
        const storedIdols = JSON.parse(localStorage.getItem('idol') || '[]');
        const storedIdolSpeeds = JSON.parse(localStorage.getItem('idolspeed') || '[]');
        const storedIdolLevels = JSON.parse(localStorage.getItem('idollvl') || '[]');
        setIdols(charactersData.filter((_, index) => storedIdols[index] === 1).map(idol => ({
            ...idol,
            currentSpeed: storedIdolSpeeds[idol.id - 1] || idol.speed,
            level: storedIdolLevels[idol.id - 1] || 1
        })));

        const updatePoints = () => {
            const currentPoints = parseInt(localStorage.getItem('point') || '0', 10);
            setPoints(currentPoints);
        };

        updatePoints();
        const intervalId = setInterval(updatePoints, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'R': return 'text-blue-500';
            case 'SR': return 'text-purple-500';
            case 'SSR': return 'text-yellow-500';
            case 'UR': return 'text-red-500';
            default: return 'text-white';
        }
    };

    const openModal = (idol: Character & { level: number, currentSpeed: number }) => {
        setSelectedIdol(idol);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedIdol(null);
        setShowModal(false);
    };

    const upgradeIdol = () => {
        if (selectedIdol) {
            const upgradeCost = selectedIdol.level * 100;
            if (points >= upgradeCost) {
                const newLevel = selectedIdol.level + 1;
                const newPoints = points - upgradeCost;
                const newSpeed = selectedIdol.currentSpeed + selectedIdol.speed;

                // Cập nhật cấp độ trong localStorage
                const storedIdolLevels = JSON.parse(localStorage.getItem('idollvl') || '[]');
                storedIdolLevels[selectedIdol.id - 1] = newLevel;
                localStorage.setItem('idollvl', JSON.stringify(storedIdolLevels));

                // Cập nhật tốc độ trong localStorage
                const storedIdolSpeeds = JSON.parse(localStorage.getItem('idolspeed') || '[]');
                storedIdolSpeeds[selectedIdol.id - 1] = newSpeed;
                localStorage.setItem('idolspeed', JSON.stringify(storedIdolSpeeds));

                // Cập nhật điểm trong localStorage
                localStorage.setItem('point', newPoints.toString());

                // Hoàn thành nhiệm vụ 3: Nâng cấp 1 idol
                const dailyMissions = JSON.parse(localStorage.getItem('dailyMissions') || '[]');
                if (dailyMissions[2] === 0) {
                    dailyMissions[2] = 1;
                    localStorage.setItem('dailyMissions', JSON.stringify(dailyMissions));
                }

                // Cập nhật state
                setIdols(prevIdols => prevIdols.map(idol =>
                    idol.id === selectedIdol.id ? { ...idol, level: newLevel, currentSpeed: newSpeed } : idol
                ));
                setSelectedIdol({ ...selectedIdol, level: newLevel, currentSpeed: newSpeed });
                setPoints(newPoints);
            } else {
                // Xử lý trường hợp không đủ điểm
            }
        }
    };

    const IdolModal = () => {
        if (!selectedIdol) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                    <div className="relative w-full aspect-square mb-4">
                        <Image
                            src={selectedIdol.image}
                            alt={selectedIdol.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{selectedIdol.name}</h2>
                    <p>Độ hiếm: <span className={`font-bold ${getRarityColor(selectedIdol.rarity)}`}>{selectedIdol.rarity}</span></p>
                    <p className="flex justify-between items-center">
                        <div>
                            Cấp độ:
                            <span className="ml-2 font-bold text-green-300">{selectedIdol.level}</span>
                        </div>
                        <button
                            onClick={upgradeIdol}
                            className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg text-white font-bold text-sm"
                        >
                            <div className="flex items-center"><FaArrowUp className="inline mr-1" /> {selectedIdol.level * 100} điểm</div>
                        </button>
                    </p>
                    <p className="flex items-center">
                        Tốc độ: <span className="mx-2 text-blue-300">{selectedIdol.currentSpeed}</span>
                        <span className="text-sm">
                            → <span className="mx-2 font-bold text-green-300">{selectedIdol.currentSpeed + selectedIdol.speed}</span>
                        </span>
                    </p>
                    <div className="mt-4">
                        <button
                            onClick={closeModal}
                            className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-bold"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SortModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Sắp xếp theo</h2>
                <div className="flex flex-col gap-2">
                    {['rarity', 'level', 'speed', 'name'].map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                setSortBy(option);
                                setShowSortModal(false);
                            }}
                            className={`w-full text-left p-2 rounded ${sortBy === option ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-500`}
                        >
                            {option === 'rarity' && 'Độ hiếm'}
                            {option === 'level' && 'Cấp độ'}
                            {option === 'speed' && 'Tốc độ'}
                            {option === 'name' && 'Tên'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowSortModal(false)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    const sortIdols = (idols: (Character & { level: number, currentSpeed: number })[]) => {
        switch (sortBy) {
            case 'rarity':
                return [...idols].sort((a, b) => {
                    const rarityOrder = { 'UR': 0, 'SSR': 1, 'SR': 2, 'R': 3 };
                    return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
                });
            case 'level':
                return [...idols].sort((a, b) => b.level - a.level);
            case 'speed':
                return [...idols].sort((a, b) => b.currentSpeed - a.currentSpeed);
            case 'name':
                return [...idols].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return idols;
        }
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex items-center'>
                        <FaArrowLeftLong
                            className='text-xl cursor-pointer'
                            onClick={() => router.push('/AniPhone/setting/user-center/anistar')}
                        />
                        <h1 className="text-xl font-[600] mx-4">Nhân vật</h1>
                    </div>
                    <div className='flex items-center cursor-pointer'
                        onClick={() => setShowSortModal(true)}>
                        <FaSort
                            className="text-2xl"
                        />
                        <span className="font-bold ml-2">
                            {sortBy === 'rarity' && 'Độ hiếm'}
                            {sortBy === 'level' && 'Cấp độ'}
                            {sortBy === 'speed' && 'Tốc độ'}
                            {sortBy === 'name' && 'Tên'}
                        </span>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-xl font-semibold">Điểm: <span className="text-yellow-300">{points}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 h-[71vh] overflow-y-auto">
                    {sortIdols(idols).map((idol, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-2 cursor-pointer" onClick={() => openModal(idol)}>
                            <div className="relative w-full aspect-square mb-2">
                                <Image
                                    src={idol.image}
                                    alt={idol.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                            <h3 className="text-lg font-semibold">{idol.name}</h3>
                            <p>Độ hiếm: <span className={`font-bold ${getRarityColor(idol.rarity)}`}>{idol.rarity}</span></p>
                            <p>Cấp độ: <span className="font-bold text-green-300">{idol.level}</span></p>
                            <p>Tốc độ: <span className="font-bold text-blue-300">{idol.currentSpeed}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && <IdolModal />}
            {showSortModal && <SortModal />}
        </div>
    );
};

export default IdolGallery;