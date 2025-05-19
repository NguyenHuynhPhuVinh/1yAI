'use client'

import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import Image from 'next/image';
import { Character, charactersData } from '@/components/CharactersData';

interface Job {
    id: number;
    name: string;
    basePointsPerSecond: number;
}

const jobs: Job[] = [
    { id: 1, name: "Hỗ trợ giải toán", basePointsPerSecond: 0.1 },
    { id: 2, name: "Giúp đặt mật khẩu", basePointsPerSecond: 0.2 },
    { id: 3, name: "Xác thực CAPTCHA", basePointsPerSecond: 0.25 },
    { id: 4, name: "Giãi mã tin nhắn", basePointsPerSecond: 0.3 },
    { id: 5, name: "Đọc truyện kiếm tiền", basePointsPerSecond: 0.4 },
    { id: 6, name: "Khảo sát kiếm tiền", basePointsPerSecond: 0.5 },
    { id: 7, name: "Xem quảng cáo kiếm tiền", basePointsPerSecond: 0.55 },
    { id: 8, name: "Chơi game kiếm tiền", basePointsPerSecond: 0.6 },
    { id: 9, name: "Gacha kiếm tiền", basePointsPerSecond: 0.66 },
    { id: 10, name: "Kiếm tiền từ LinkGO", basePointsPerSecond: 0.7 },
    { id: 11, name: "Kiếm tiền từ CrazyNumber", basePointsPerSecond: 0.8 },
    { id: 12, name: "Kiếm tiền từ Tic-Tac-Toe Online", basePointsPerSecond: 0.88 },
    { id: 13, name: "Kiếm tiền từ AdClicker", basePointsPerSecond: 0.9 },
    { id: 14, name: "Kiếm tiền từ SurveyPay", basePointsPerSecond: 1 },

];

const FarmPage = () => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [jobAssignments, setJobAssignments] = useState<number[]>([]);

    useEffect(() => {
        const storedIdols = JSON.parse(localStorage.getItem('idol') || '[]');
        const storedIdolSpeeds = JSON.parse(localStorage.getItem('idolspeed') || '[]');
        setCharacters(charactersData.filter((_, index) => storedIdols[index] === 1).map(char => ({
            ...char,
            speed: storedIdolSpeeds[char.id - 1] || char.speed
        })));

        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        setJobAssignments(storedJobs.length ? storedJobs : new Array(jobs.length).fill(-1));
    }, []);

    const openModal = (job: Job) => {
        if (jobAssignments[job.id - 1] !== -1) {
            setSelectedJob(job);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setSelectedJob(null);
        setShowModal(false);
    };

    const assignJob = (characterId: number) => {
        if (selectedJob) {
            const newAssignments = [...jobAssignments];
            const previousJobIndex = newAssignments.findIndex(job => job === characterId);
            if (previousJobIndex !== -1) {
                newAssignments[previousJobIndex] = 0;
            }
            newAssignments[selectedJob.id - 1] = characterId;
            setJobAssignments(newAssignments);
            localStorage.setItem('jobs', JSON.stringify(newAssignments));
            // Hoàn thành nhiệm vụ 1
            const storedMissionStatuses = JSON.parse(localStorage.getItem('dailyMissions') || '[]');
            if (storedMissionStatuses[0] === 0) {
                storedMissionStatuses[0] = 1;
                localStorage.setItem('dailyMissions', JSON.stringify(storedMissionStatuses));
            }
            closeModal();
        }
    };

    const fireCharacter = (jobId: number) => {
        const newAssignments = [...jobAssignments];
        newAssignments[jobId - 1] = 0;
        setJobAssignments(newAssignments);
        localStorage.setItem('jobs', JSON.stringify(newAssignments));
        // Hoàn thành nhiệm vụ 2
        const storedMissionStatuses = JSON.parse(localStorage.getItem('dailyMissions') || '[]');
        if (storedMissionStatuses[1] === 0) {
            storedMissionStatuses[1] = 1;
            localStorage.setItem('dailyMissions', JSON.stringify(storedMissionStatuses));
        }

        closeModal();
    };

    const calculatePointsPerSecond = (job: Job, character: Character) => {
        return job.basePointsPerSecond * character.speed;
    };

    const JobModal = () => {
        if (!selectedJob) return null;

        const assignedCharacterId = jobAssignments[selectedJob.id - 1];
        const assignedCharacter = characters.find(char => char.id === assignedCharacterId);

        if (assignedCharacter) {
            const pointsPerSecond = calculatePointsPerSecond(selectedJob, assignedCharacter);
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4 text-center">Thông tin</h2>
                        <div className="flex items-center mb-4">
                            <Image
                                src={assignedCharacter.image}
                                alt={assignedCharacter.name}
                                width={60}
                                height={60}
                                className="rounded-full mr-4"
                            />
                            <div>
                                <p className="font-bold text-lg">{assignedCharacter.name}</p>
                                <p className="text-sm text-blue-300">Tốc độ: {assignedCharacter.speed}</p>
                                <p className="text-sm text-yellow-400">Điểm/giây: {pointsPerSecond.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => fireCharacter(selectedJob.id)}
                            className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-bold mb-4"
                        >
                            Sa thải
                        </button>
                        <button
                            onClick={closeModal}
                            className="w-full bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-bold"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            );
        }

        const availableCharacters = characters.filter(character => !jobAssignments.includes(character.id));

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mx-4">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 max-w-md">
                    <h2 className="text-xl font-bold mb-3 text-center">Chọn nhân vật</h2>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                        {availableCharacters.map((character) => (
                            <div key={character.id} className="flex items-center bg-gray-700 p-2 rounded-lg">
                                <Image
                                    src={character.image}
                                    alt={character.name}
                                    width={50}
                                    height={50}
                                    className="rounded-full mr-3"
                                />
                                <div className="flex flex-col justify-center flex-grow">
                                    <p className="text-base font-semibold">{character.name}</p>
                                    <p className="text-sm text-blue-300 font-bold">Tốc độ: {character.speed}</p>
                                    <p className="text-sm text-yellow-400 font-bold">Điểm/giây: {calculatePointsPerSecond(selectedJob, character).toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => assignJob(character.id)}
                                    className="ml-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-white text-sm font-bold"
                                >
                                    Chọn
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={closeModal}
                        className="mt-4 w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-white text-sm font-bold"
                    >
                        Đóng
                    </button>
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
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting/user-center/anistar')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Làm việc</h1>
                </div>
                <div className="grid gap-4 h-[77vh] overflow-y-auto">
                    {jobs.map((job) => {
                        const assignedCharacterId = jobAssignments[job.id - 1];
                        return (
                            <div key={job.id} className={`bg-gray-800 rounded-lg p-4 ${assignedCharacterId !== -1 ? 'cursor-pointer' : 'opacity-50'}`} onClick={() => openModal(job)}>
                                <h3 className="text-lg font-semibold">{job.name}</h3>
                                <p className="mt-1">
                                    Trạng thái: {' '}
                                    {assignedCharacterId === -1 ? (
                                        <span className="text-red-500">Đã khóa</span>
                                    ) : assignedCharacterId === 0 ? (
                                        <span className="text-blue-500">Chưa giao</span>
                                    ) : (
                                        <span className="text-green-500">Đã giao</span>
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {showModal && <JobModal />}
        </div>
    );
};

export default FarmPage;