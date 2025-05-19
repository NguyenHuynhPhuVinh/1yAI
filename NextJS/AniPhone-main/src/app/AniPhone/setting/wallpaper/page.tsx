'use client'

import { useState, useEffect } from 'react';
import Nav from '@/components/nav';
import Image from 'next/image';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaRandom } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { IoLinkOutline } from "react-icons/io5";

const WallpaperPage = () => {
    const [wallpapers, setWallpapers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [customImageUrl, setCustomImageUrl] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const fetchWallpapers = async () => {
        setIsLoading(true);
        try {
            const apiUrl = 'https://api.waifu.im/search?is_nsfw=false&many=true&orientation=PORTRAIT';
            let allWallpapers: string[] = [];
            for (let i = 0; i < 10; i++) {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch wallpapers');
                }
                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    const wallpaperUrls = data.images.map((image: { url: string }) => image.url);
                    allWallpapers = [...allWallpapers, ...wallpaperUrls];
                }
            }
            setWallpapers(allWallpapers);
        } catch (error) {
            console.error('Error fetching wallpapers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setWallpaper = (url: string) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('backgroundImageUrl', url);
            window.sessionStorage.setItem('backgroundImageUrl', url);
            router.push('/AniPhone');
        }
    };

    const setRandomWallpaper = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('backgroundImageUrl');
            window.sessionStorage.removeItem('backgroundImageUrl');
            router.push('/AniPhone');
        }
    };

    const handleCustomImageSubmit = () => {
        if (customImageUrl) {
            setPreviewImageUrl(customImageUrl);
        }
    };

    const handleSetCustomWallpaper = () => {
        if (previewImageUrl) {
            setWallpaper(previewImageUrl);
            setShowModal(false);
        }
    };

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaArrowLeftLong className='text-xl cursor-pointer mr-4'
                            onClick={() => router.push('/AniPhone/setting')}
                        />
                        <h1 className="text-xl font-[600]">Hình nền</h1>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="mr-4 bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-full"
                            title="Thêm ảnh từ link"
                        >
                            <IoLinkOutline className="text-xl" />
                        </button>
                        <button
                            onClick={fetchWallpapers}
                            className="mr-4 bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-full"
                            title="Làm mới"
                        >
                            <IoRefresh className="text-xl" />
                        </button>
                        <button
                            onClick={setRandomWallpaper}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-2 rounded-full"
                        >
                            <FaRandom className="text-xl" />
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-[70vh]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 max-h-[77vh] overflow-y-auto p-4">
                        {wallpapers.map((url, index) => (
                            <div
                                key={index}
                                className="aspect-[9/16] cursor-pointer relative overflow-hidden rounded-lg shadow-lg mb-6"
                                onClick={() => setWallpaper(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`Wallpaper ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm ảnh từ link</h2>
                        <input
                            type="text"
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            placeholder="Nhập link ảnh"
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                        />
                        <button
                            onClick={handleCustomImageSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Xem trước
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Hủy
                        </button>
                        {previewImageUrl && (
                            <div className="mt-4">
                                <Image
                                    src={previewImageUrl}
                                    alt="Preview"
                                    width={200}
                                    height={356}
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                                <button
                                    onClick={handleSetCustomWallpaper}
                                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Đặt làm hình nền
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WallpaperPage;
