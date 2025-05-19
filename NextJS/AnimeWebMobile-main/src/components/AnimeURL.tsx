'use client'

import Image from 'next/image';
import 'animate.css';
import AOS from "aos";
import "aos/dist/aos.css"
import { useEffect } from 'react';

// Định nghĩa một mảng JSON chứa thông tin của từng icon
const iconData = [
    {
        id: 1,
        name: 'Anime',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} vietsub`,
    },
    {
        id: 2,
        name: 'Thông Tin',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} tin tức`,
    },
    {
        id: 3,
        name: 'Manga',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} đọc manga`,
    },
    {
        id: 4,
        name: 'Light Novel',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} đọc light novel`,
    },
    {
        id: 5,
        name: 'Ảnh',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} kho ảnh`,
    },
];


const iconShowData = [
    {
        id: 1,
        name: 'AnimeVietSub',
        url: 'https://animevietsub.app/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AnimeVietSub`,
    },
    {
        id: 1,
        name: 'Animet',
        url: 'https://animet1.net/Theme_Anime/img/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Animet`,
    },
    {
        id: 1,
        name: 'AnimeTVN',
        url: 'https://animetvn4.com/images/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AnimeTVN`,
    },
    {
        id: 1,
        name: 'Ani4u',
        url: 'https://ani4u.org/wp-content/uploads/2017/06/favicon-ani4u2017.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Ani4u`,
    },
    {
        id: 1,
        name: 'VuiGhe',
        url: 'https://vuighe3.com/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} VuiGhe`,
    },
    {
        id: 1,
        name: 'Anime47',
        url: 'https://anime47.link/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Anime47`,
    },
    {
        id: 1,
        name: 'AnimeHay',
        url: 'https://animehay.in/themes/img/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AnimeHay`,
    },
    {
        id: 1,
        name: 'HhPanda',
        url: 'https://hhpanda.tube/static/favicon.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} HhPanda`,
    },
    {
        id: 1,
        name: 'VuiAnime',
        url: 'https://vuianime.org/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} VuiAnime`,
    },
    {
        id: 1,
        name: 'AniVN',
        url: '/anivn.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AniVN`,
    },
    {
        id: 1,
        name: 'Wibu47',
        url: '/wibu47.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Wibu47`,
    },
    {
        id: 1,
        name: 'AniMew',
        url: 'https://animew.org/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Animew`,
    },
    {
        id: 2,
        name: 'MyAnimeList',
        url: 'https://cdn.myanimelist.net/images/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} MyAnimeList`,
    },
    {
        id: 2,
        name: 'Kitsu',
        url: 'https://kitsu.io/favicon-32x32-3e0ecb6fc5a6ae681e65dcbc2bdf1f17.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Kitsu`,
    },
    {
        id: 2,
        name: 'AniList',
        url: 'https://anilist.co/img/icons/favicon-32x32.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AniList`,
    },
    {
        id: 2,
        name: 'AniDB',
        url: 'https://cdn-eu.anidb.net/css/assets/images/touch/favicon-32x32.png?v=2023-11-02T17-27-31',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AniDB`,
    },
    {
        id: 2,
        name: 'ANN',
        url: 'https://www.animenewsnetwork.com/meta/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AnimeNewsNetwork`,
    },
    {
        id: 2,
        name: 'AniSearch',
        url: 'https://www.anisearch.com/favicon2.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AniSearch`,
    },
    {
        id: 2,
        name: 'AnimePlanet',
        url: '/animeplanet.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} AnimePlanet`,
    },
    {
        id: 2,
        name: 'OneEsportsVN',
        url: '/oneEs.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} One Esports Việt Nam`,
    },
    {
        id: 2,
        name: 'MyTour',
        url: 'https://mytour.vn/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} My Tour VN`,
    },
    {
        id: 2,
        name: 'EpicDope',
        url: '/epicdope.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Epic Dope`,
    },
    {
        id: 3,
        name: 'BlogTruyen',
        url: 'https://blogtruyen.vn/Content/themes/img/favicon.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} BlogTruyen`,
    },
    {
        id: 3,
        name: 'NetTruyen',
        url: 'https://nettruyenaa.com/public/assets/images/favicon.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} NetTruyen`,
    },
    {
        id: 3,
        name: 'TruyenQQ',
        url: 'https://st.truyenqqviet.com/template/frontend/images/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} TruyenQQ`,
    },
    {
        id: 3,
        name: 'NetTruyenFull',
        url: 'https://nettruyenfull.com/images/Favicon-16x16.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} NetTruyenFull`,
    },
    {
        id: 3,
        name: 'MangaDex',
        url: 'https://mangadex.org/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} MangaDex`,
    },
    {
        id: 3,
        name: 'TachiyomiSY',
        url: '/tachiyomisy.png',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} TachiyomiSY`,
    },
    {
        id: 4,
        name: 'Hako',
        url: 'https://docln.net/img/favicon.png?v=3',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Hako`,
    },
    {
        id: 4,
        name: 'LNVN',
        url: 'https://lnvn.net/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} LNVN`,
    },
    {
        id: 4,
        name: 'Sonako',
        url: '/sonako.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Sonako`,
    },
    {
        id: 5,
        name: 'Pixiv',
        url: 'https://www.pixiv.net/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} Pixiv`,
    },
    {
        id: 5,
        name: 'ZeroChan',
        url: 'zerochan.webp',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} ZeroChan`,
    },
    {
        id: 5,
        name: 'SafeBooru',
        url: 'https://safebooru.org/favicon.ico',
        searchUrl: (animeTitle: string) => `https://www.google.com/search?q=${encodeURIComponent(animeTitle)} SafeBooru`,
    }
];

interface Props {
    animeData: {
        data: {
            attributes: {
                titles: {
                    en_jp: string;
                    en: string;
                    ja_jp: string;
                };
                subtype: string;
            };
        };
    };
}

const AnimeURL: React.FC<Props> = ({ animeData }) => {
    useEffect(() => {
        AOS.init({})
    }, [])

    return (
        <div>
            <div className="flex justify-center items-center mt-4">
                <button
                    className="bg-green-500 hover:bg-green-600 font-bold text-white py-2 px-4 rounded-md animate__animated animate__fadeIn"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const formattedAnimeTitle = encodeURIComponent(`${animeTitle} official trailer`); // Định dạng tên anime và chuỗi "trailer" cho URL
                        const youtubeUrl = `https://www.youtube.com/results?search_query=${formattedAnimeTitle}`;
                        window.open(youtubeUrl, '_blank');
                    }}
                >
                    Trailer
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 font-bold text-white py-2 px-4 mx-4 rounded-md animate__animated animate__fadeIn"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const formattedAnimeTitle = encodeURIComponent(`${animeTitle} vietsub`); // Định dạng tên anime và chuỗi "trailer" cho URL
                        const youtubeUrl = `https://www.youtube.com/results?search_query=${formattedAnimeTitle}`;
                        window.open(youtubeUrl, '_blank');
                    }}
                >
                    VietSub
                </button>
                <div className="bg-blue-500 hover:bg-blue-600 flex rounded-l-md rounded-r-md animate__animated animate__fadeIn">
                    <button
                        className="font-bold text-white py-2 pl-4"
                        onClick={() => {
                            const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                            const formattedAnimeTitle = encodeURIComponent(`${animeTitle} OP`); // Định dạng tên anime và chuỗi "trailer" cho URL
                            const youtubeUrl = `https://www.youtube.com/results?search_query=${formattedAnimeTitle}`;
                            window.open(youtubeUrl, '_blank');
                        }}
                    >
                        OP
                    </button>
                    <h1 className="font-bold text-white py-2">/</h1>
                    <button
                        className="font-bold text-white py-2 pr-4"
                        onClick={() => {
                            const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                            const formattedAnimeTitle = encodeURIComponent(`${animeTitle} ED`); // Định dạng tên anime và chuỗi "trailer" cho URL
                            const youtubeUrl = `https://www.youtube.com/results?search_query=${formattedAnimeTitle}`;
                            window.open(youtubeUrl, '_blank');
                        }}
                    >
                        ED
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center mt-4">
                <button
                    className="bg-white hover:bg-gray-200 font-bold text-black py-2 px-4 rounded-md animate__animated animate__fadeIn animate__slow"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.ja_jp || animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const formattedAnimeTitle = encodeURIComponent(`${animeTitle} 公式ウェブサイト`); // Định dạng tên anime và chuỗi "trailer" cho URL
                        const ggUrl = `https://www.google.com/search?q=${formattedAnimeTitle}`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    Website
                </button>
                <button
                    className="border-white border hover:border-gray-200 font-bold text-white py-1 px-1 mx-4 rounded-md animate__animated animate__fadeIn animate__slow"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.ja_jp || animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const formattedAnimeTitle = encodeURIComponent(`${animeTitle} ツイッター 公式 アニメ `); // Định dạng tên anime và chuỗi "trailer" cho URL
                        const ggUrl = `https://www.google.com/search?q=${formattedAnimeTitle}`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/X.avif"}
                        alt={`X Icon`}
                        width={30}
                        height={30}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="bg-white hover:bg-gray-200 font-bold text-black py-2 px-4 rounded-md animate__animated animate__fadeIn animate__slow"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.ja_jp || animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const formattedAnimeTitle = encodeURIComponent(`${animeTitle}`);
                        const subtype = animeData.data.attributes.subtype.toLowerCase();
                        let searchQuery = formattedAnimeTitle;

                        if (subtype === 'music') {
                            searchQuery += encodeURIComponent(' official music');
                        }

                        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
                        window.open(youtubeUrl, '_blank');
                    }}
                >
                    Youtube
                </button>
            </div>
            <div className="flex justify-center items-center bg-gradient-to-r from-primary to-secondary rounded-lg mt-6 px-4 mx-4 animate__animated animate__fadeIn animate__slower">
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} facebook`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/facebook.webp"}
                        alt={`facebook Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} twitter`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/X.avif"}
                        alt={`X Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} instagram`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/instagram.webp"}
                        alt={`Instagram Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} tiktok`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/tiktok.webp"}
                        alt={`Tiktok Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} pinterest`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/pinterest.webp"}
                        alt={`Pinterest Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} reddit`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/reddit.webp"}
                        alt={`Reddit Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
                <button
                    className="border bg-black px-1 py-1 mx-1 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                        const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                        const ggUrl = `https://www.google.com/search?q=${animeTitle} threads`;
                        window.open(ggUrl, '_blank');
                    }}
                >
                    <Image
                        src={"/threads.webp"}
                        alt={`Threads Icon`}
                        width={25}
                        height={25}
                        priority={true}
                        className={``}
                        placeholder="empty"
                    />
                </button>
            </div>
            {iconData.map((icon, index) => (
                <div key={index} data-aos="flip-up">
                    <div className="relative my-4 mx-4 mt-10">
                        <div className="absolute inset-0 flex justify-center items-center">
                            <h1 className={`pt-2 px-4 rounded-t-2xl font-bold text-md px-2 cursor-pointer ${icon.id === 1 ? 'bg-rose-400 hover:text-red-500 text-white' : icon.id === 2 ? 'bg-blue-900 hover:text-red-500 text-white' : icon.id === 3 ? 'bg-yellow-200 hover:text-red-500 text-black' : icon.id === 4 ? 'bg-purple-50 hover:text-red-500 text-black' : 'bg-gray-200 hover:text-red-500 text-black'}`} onClick={() => {
                                const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                                // Định dạng tên anime cho URL
                                window.open(icon.searchUrl(animeTitle), '_blank');
                            }}>
                                {icon.name}
                            </h1>
                        </div>
                    </div>
                    <div className={`rounded-2xl mx-4 pt-8 pb-6 flex justify-center items-center mt-12 ${icon.id === 1 ? 'bg-rose-400' : icon.id === 2 ? 'bg-blue-900' : icon.id === 3 ? 'bg-yellow-200' : icon.id === 4 ? 'bg-purple-50' : 'bg-gray-200'}`}>
                        <div className="flex flex-wrap justify-center items-center">
                            {iconShowData.map((icons, idx) => {
                                // Kiểm tra nếu icons.id === icon.id thì mới hiển thị iconShowData
                                if (icons.id === icon.id) {
                                    return (
                                        <div key={idx} className="border bg-black px-1 py-1 mx-2 my-2 rounded-lg border-gray-800 shadow-2xl cursor-pointer" data-aos="fade-up"
                                            onClick={() => {
                                                const animeTitle = animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en;
                                                // Định dạng tên anime cho URL
                                                window.open(icons.searchUrl(animeTitle), '_blank');
                                            }}
                                        >
                                            <Image
                                                src={icons.url}
                                                alt={`${icons.name} Icon`}
                                                width={30}
                                                height={30}
                                                priority={true}
                                                className={`rounded-lg ${icons.name === "LNVN" ? "bg-white" : ""}`}
                                                placeholder="empty"
                                            />
                                        </div>
                                    );
                                }
                                return null; // Trả về null nếu không thỏa điều kiện
                            })}
                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    );
}

export default AnimeURL;