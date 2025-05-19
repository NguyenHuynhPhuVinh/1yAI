'use client'

import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import Image from 'next/image';
import { Character, charactersData } from '@/components/CharactersData';

const GachaPage = () => {
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [gachaResults, setGachaResults] = useState<Character[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showCharacterListModal, setShowCharacterListModal] = useState(false);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);

    useEffect(() => {
        const updatePoints = () => {
            if (!showModal && !showBannerModal && !showCharacterListModal) {
                const storedPoints = parseInt(localStorage.getItem('point') || '0', 10);
                setPoints(storedPoints);
            }
        };

        updatePoints();
        setCharacters(charactersData);

        const pointsIntervalId = setInterval(updatePoints, 1000);
        const characterIntervalId = setInterval(() => {
            if (!showModal && !showBannerModal && !showCharacterListModal) {
                setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % 2);
            }
        }, 5000);

        return () => {
            clearInterval(pointsIntervalId);
            clearInterval(characterIntervalId);
        };
    }, [showBannerModal, showCharacterListModal, showModal]);

    const banner = {
        name: 'Banner Thường - Sự khởi đầu của AniStar',
        cost: 100,
        featuredCharacterIds: [1, 8] // Assuming Nico Yazawa has id 1 and Maki Nishikino has id 2
    };

    const featuredCharacters = banner.featuredCharacterIds.map(id => charactersData.find(char => char.id === id));

    const performGacha = (times: number) => {
        const totalCost = banner.cost * times;
        if (points < totalCost) {
            alert('Không đủ điểm!');
            return;
        }

        const newPoints = points - totalCost;
        setPoints(newPoints);
        localStorage.setItem('point', newPoints.toString());

        const results = [];
        for (let i = 0; i < times; i++) {
            const randomNumber = Math.random() * 100;
            let rarity;
            if (randomNumber < 70) {
                rarity = 'R';
            } else if (randomNumber < 90) {
                rarity = 'SR';
            } else if (randomNumber < 97) {
                rarity = 'SSR';
            } else {
                rarity = 'UR';
            }

            const charactersOfRarity = characters.filter(char => char.rarity === rarity);
            const randomIndex = Math.floor(Math.random() * charactersOfRarity.length);
            const result = charactersOfRarity[randomIndex];
            results.push(result);

            const storedIdols = JSON.parse(localStorage.getItem('idol') || '[]');
            storedIdols[result.id - 1] = 1;
            localStorage.setItem('idol', JSON.stringify(storedIdols));

            let storedIdolSpeeds = JSON.parse(localStorage.getItem('idolspeed') || '[]');
            if (storedIdolSpeeds.length < characters.length) {
                storedIdolSpeeds = [...storedIdolSpeeds, ...new Array(characters.length - storedIdolSpeeds.length).fill(0)];
            }
            if (!storedIdolSpeeds[result.id - 1]) {
                storedIdolSpeeds[result.id - 1] = result.speed;
                localStorage.setItem('idolspeed', JSON.stringify(storedIdolSpeeds));
            }

            let storedIdolLevels = JSON.parse(localStorage.getItem('idollvl') || '[]');
            if (storedIdolLevels.length < characters.length) {
                storedIdolLevels = [...storedIdolLevels, ...new Array(characters.length - storedIdolLevels.length).fill(0)];
            }
            if (!storedIdolLevels[result.id - 1]) {
                storedIdolLevels[result.id - 1] = 1;
                localStorage.setItem('idollvl', JSON.stringify(storedIdolLevels));
            }
        }

        // Hoàn thành nhiệm vụ 4: Thực hiện 1 lần gacha
        const dailyMissions = JSON.parse(localStorage.getItem('dailyMissions') || '[]');
        if (dailyMissions[3] === 0) {
            dailyMissions[3] = 1;
            localStorage.setItem('dailyMissions', JSON.stringify(dailyMissions));
        }

        setGachaResults(results);
        setShowModal(true);
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'R': return 'text-blue-500';
            case 'SR': return 'text-purple-500';
            case 'SSR': return 'text-yellow-500';
            case 'UR': return 'text-red-500';
            default: return 'text-white';
        }
    };

    const GachaModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Kết Quả Gacha:</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {gachaResults.map((result, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <Image
                                src={result.image}
                                alt={result.name}
                                width={100}
                                height={100}
                                className="rounded-full mb-2 border-2 border-purple-500"
                            />
                            <p className="text-lg font-semibold">{result.name}</p>
                            <p className="text-sm">Độ Hiếm: <span className={`font-bold ${getRarityColor(result.rarity)}`}>{result.rarity}</span></p>
                            <p className="text-sm">Tốc độ: <span className="font-bold text-blue-300">{result.speed}</span></p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    const BannerModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">{banner.name}</h2>
                <div className='h-[60vh] overflow-y-auto'>
                    {featuredCharacters.map((character, index) => (
                        <div key={index} className="flex flex-col items-center mb-4">
                            <Image
                                src={character?.image || ''}
                                alt={character?.name || ''}
                                width={200}
                                height={200}
                                className="rounded-lg mb-4 mx-auto"
                            />
                            <p className="text-xl mb-2">{character?.name}</p>
                            <p className="text-lg mb-2">Độ hiếm: <span className={`font-bold ${getRarityColor(character?.rarity || '')}`}>{character?.rarity}</span></p>
                            <p className="text-lg mb-2">Tốc độ: <span className="font-bold text-blue-300">{character?.speed}</span></p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setShowBannerModal(false)}
                    className="mt-4 w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-bold"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    const CharacterListModal = () => {
        const rarities = ['UR', 'SSR', 'SR', 'R'];
        const rarityPercentages = {
            'UR': 3,
            'SSR': 7,
            'SR': 20,
            'R': 70
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
                    <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-600 pb-2">Tỉ lệ Gacha</h2>
                    <button
                        onClick={() => setShowCharacterListModal(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        <IoClose className="h-6 w-6" />
                    </button>
                    {rarities.map(rarity => (
                        <div key={rarity} className="mb-6 border border-gray-600 rounded-lg p-4">
                            <h3 className={`text-xl font-bold mb-3 ${getRarityColor(rarity)} flex justify-between items-center`}>
                                <span>{rarity}</span>
                                <span className="text-lg">{rarityPercentages[rarity as keyof typeof rarityPercentages]}%</span>
                            </h3>
                            <div className="flex flex-col gap-2">
                                {characters.filter(char => char.rarity === rarity).map(character => {
                                    const characterPercentage = (rarityPercentages[rarity as keyof typeof rarityPercentages] / characters.filter(c => c.rarity === rarity).length).toFixed(2);
                                    return (
                                        <p key={character.id} className="text-sm bg-gray-700 p-2 rounded flex justify-between">
                                            <span>{character.name}</span>
                                            <span>{characterPercentage}%</span>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className="text-xl cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/user-center/anistar')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Gacha</h1>
                    <FaInfoCircle
                        className="text-xl cursor-pointer ml-auto"
                        onClick={() => setShowCharacterListModal(true)}
                    />
                </div>
                <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
                    <p className="text-xl font-semibold">Điểm: <span className="text-yellow-300">{points}</span></p>
                </div>
                <div className="mb-8">
                    <div
                        className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setShowBannerModal(true)}
                    >
                        {featuredCharacters[currentCharacterIndex] && (
                            <Image
                                src={featuredCharacters[currentCharacterIndex].image}
                                alt={featuredCharacters[currentCharacterIndex].name}
                                layout="fill"
                                objectFit="cover"
                                className="opacity-50"
                            />
                        )}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black to-transparent">
                            <h2 className="text-xl font-bold mb-2">{banner.name}</h2>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => performGacha(1)}
                        disabled={points < banner.cost}
                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Quay x1 ({banner.cost} điểm)
                    </button>
                    <button
                        onClick={() => performGacha(10)}
                        disabled={points < (banner.cost * 10)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Quay x10 ({banner.cost * 10} điểm)
                    </button>
                </div>
            </div>
            {showModal && <GachaModal />}
            {showBannerModal && <BannerModal />}
            {showCharacterListModal && <CharacterListModal />}
        </div>
    );
};

export default GachaPage;
