'use client'
import { Suspense, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeURL from '../../components/AnimeURL'
import Lottie from 'lottie-react';
import ReturnArrowData from '../../icon/return_arrow.json';
import HeartData from '../../icon/heart.json';
import StarData from '../../icon/star.json';
import "animate.css"

const returnArrowStyle = {
    width: 35,
    height: 35,
}

const heartStyle = {
    width: 35,
    height: 35,
}

const starStyle = {
    width: 35,
    height: 35,
}

// Hàm để viết hoa chữ cái đầu
function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Thêm các biến màu mới
const colors = {
    background: 'bg-gray-900',
    primary: 'bg-pink-600',
    secondary: 'bg-purple-700',
    text: 'text-gray-100',
    accent: 'text-pink-400',
    highlight: 'text-cyan-300',
};

// Thêm styles cho hiệu ứng sáng chói
const glowStyles = `
  @keyframes glow {
    0% {
      box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00de, 0 0 25px #ff00de;
    }
    100% {
      box-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #ff00de, 0 0 12.5px #ff00de;
    }
  }

  .glow-effect {
    animation: glow 1.5s ease-in-out infinite alternate;
  }
`;

const AnimePage = () => {
    const [copied, setCopied] = useState(false);
    const [isZoomed, setIsZoomed] = useState("");
    let items = [
        { id: "", img: "" },
    ];
    const notify = () => {
        toast.success('Đã copy!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setCopied(true);
    };
    const router = useRouter();
    const searchParams = useSearchParams();
    const animeId = searchParams.get('id') || '';

    // Function để fetch dữ liệu từ API
    const fetcher = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    };

    // Sử dụng SWR để fetch dữ liệu và tự động cache
    const { data: animeData, error, isValidating } = useSWR(
        animeId ? `https://kitsu.io/api/edge/anime/${animeId}` : null,
        fetcher,
        {
            revalidateOnFocus: false, // Không fetch lại khi focus vào cửa sổ
            revalidateOnReconnect: false, // Không fetch lại khi kết nối internet trở lại
            shouldRetryOnError: false, // Không retry khi gặp lỗi
            dedupingInterval: 60000, // Chỉ fetch lại sau 60 giây kể từ lần fetch gần nhất
        }
    );

    let startDate;
    let animeText;
    let statusText;
    if (error) return <div className={colors.text}>Đã xảy ra lỗi khi tải dữ liệu anime</div>;
    if (animeData) {
        items = [
            { id: "1", img: animeData.data.attributes.posterImage.large },
        ];
        const year = animeData.data.attributes.startDate;
        startDate = year.split('-')[0]; // Tách chuỗi bằng dấu '-', lấy phần tử đầu tiên (năm)
        statusText =
            animeData.data.attributes.status === "current"
                ? "Đang-Phát-Sóng"
                : animeData.data.attributes.status === "finished"
                    ? "Đã-Kết-Thúc"
                    : animeData.data.attributes.status === "upcoming"
                        ? "Chuẩn-Bị-Chiếu"
                        : animeData.data.attributes.status === "tba"
                            ? "Chưa-Rõ"
                            : "Sắp-Ra-Mắt";
        animeText = statusText.split("");
    }

    return (
        <>
            <style jsx global>{glowStyles}</style>
            <div className={`container mx-auto ${colors.background} py-16 min-h-screen`}>
                <nav className={`${colors.primary} fixed w-full top-0 z-10`}>
                    <div className={`${colors.secondary} text-sm font-bold py-2 mb-3 container mx-auto flex items-center justify-center relative`}>
                        <div
                            className="absolute left-0 flex items-center ml-4 cursor-pointer"
                            onClick={() => router.back()} // Thêm onClick để quay lại trang trước
                        >
                            <Lottie
                                animationData={ReturnArrowData}
                                style={returnArrowStyle}
                            />
                        </div>
                        <h1 className={`${colors.text} text-lg`}>TomiSakae</h1>
                    </div>
                </nav>
                {/* Nội dung của trang anime */}
                {isValidating ? (
                    // Improved loading animation
                    <motion.div
                        className="grid grid-cols-4 h-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="animate-pulse overflow-hidden px-4 py-3 col-start-2 col-span-2">
                            <div className="relative mx-auto h-0 pb-[142.85%] rounded-lg bg-gray-700"></div>
                            <div className="mt-2 h-4 bg-gray-700 rounded"></div>
                        </div>
                    </motion.div>
                ) : animeData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            key={items[0].id}
                            layoutId={items[0].id}
                        >
                            <div className="grid grid-cols-4">
                                <div className="px-4 py-3 col-start-2 col-span-2">
                                    <div className="relative mx-auto h-0 pb-[142.85%] rounded-lg cursor-pointer animate__animated animate__zoomInLow glow-effect" onClick={() => setIsZoomed(items[0].id)}>
                                        <Image
                                            src={animeData.data.attributes.posterImage.large}
                                            alt={animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en}
                                            width={550}
                                            height={780}
                                            priority={true}
                                            className="rounded-lg"
                                            placeholder="empty"
                                        />
                                    </div>
                                </div>
                            </div>
                            <CopyToClipboard text={animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en} onCopy={notify}>
                                <h3 className={`${colors.highlight} text-center text-lg font-semibold mt-2 mx-4 cursor-pointer animate__animated animate__fadeIn animate__faster`}>
                                    {animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en}
                                </h3>
                            </CopyToClipboard>
                            <ToastContainer
                                position="top-right"
                                autoClose={1000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover={false}
                                theme="dark"
                                className="custom-toastify"
                            />
                            <div className="flex items-center justify-center mb-3">
                                {animeData.data.attributes.ratingRank && (
                                    <div className="flex items-center justify-center text-yellow-400">
                                        <Lottie
                                            animationData={StarData}
                                            style={starStyle}
                                        />#{animeData.data.attributes.ratingRank}
                                    </div>
                                )}
                                {animeData.data.attributes.popularityRank && (
                                    <div className="flex items-center justify-center text-pink-500">
                                        <Lottie
                                            animationData={HeartData}
                                            style={heartStyle}
                                        />#{animeData.data.attributes.popularityRank}
                                    </div>
                                )}
                            </div>
                            <motion.div
                                className={`box flex text-sm justify-center items-center rounded-lg mt-2 mx-4 py-3 ${colors.secondary} glow-effect`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <h3 className={`${colors.text} font-semibold me-4`}>
                                    {capitalizeFirstLetter(animeData.data.attributes.subtype)}, {startDate}
                                </h3>
                                {animeData.data.attributes.status === "current" && animeText ? (
                                    animeText.map((el, i) => (
                                        el !== '-' ?
                                            (<motion.span
                                                className={`font-semibold text-green-500`}
                                                initial={{ y: 0, opacity: 0, }}
                                                animate={{ y: [-5, 0], opacity: 1 }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: i / 10,
                                                    repeat: Infinity,
                                                    repeatDelay: 1.5
                                                }}
                                                key={i}
                                            >
                                                {el}
                                            </motion.span>
                                            ) : (<span key={i} className="text-gray-800">-</span>)
                                    ))
                                ) : (
                                    animeText && animeText.map((el, i) => (
                                        el !== '-' ?
                                            (<motion.span
                                                className={`font-semibold ${animeData.data.attributes.status === "finished" ? "text-blue-500" : animeData.data.attributes.status === "upcoming" ? "text-gray-400" : animeData.data.attributes.status === "tba" ? "text-red-500" : "text-yellow-400"}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: i / 10,
                                                }}
                                                key={i}
                                            >
                                                {el}
                                            </motion.span>
                                            ) : (<span key={i} className="text-gray-800">-</span>)
                                    ))
                                )}
                                <h3 className={`${colors.text} font-semibold ml-4`}>
                                    {animeData.data.attributes.episodeCount ? `${animeData.data.attributes.episodeCount}t` : '??t'},{' '}
                                    {animeData.data.attributes.episodeLength ? `${animeData.data.attributes.episodeLength}p` : '??p'}
                                </h3>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <AnimeURL animeData={animeData} />
                            </motion.div>
                        </motion.div>
                        <AnimatePresence>
                            {isZoomed && (
                                <motion.div
                                    layoutId={isZoomed}
                                    className="fixed z-20 top-0 h-screen w-screen"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.button onClick={() => setIsZoomed("")}>
                                        <Image
                                            src={animeData.data.attributes.posterImage.large}
                                            alt={animeData.data.attributes.titles.en_jp || animeData.data.attributes.titles.en}
                                            width={550}
                                            height={780}
                                            priority={true}
                                            className="rounded-lg h-auto w-4/5 mx-auto mt-20"
                                            placeholder="empty"
                                        />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className={colors.text}>Đang tải dữ liệu...</div>
                )}
            </div >
        </>
    );
}

const Anime = () => {
    return (
        <Suspense>
            <AnimePage />
        </Suspense>
    );
}

export default Anime;
