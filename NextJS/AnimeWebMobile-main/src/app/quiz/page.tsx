'use client'
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaStar } from 'react-icons/fa';

interface Anime {
    id: string;
    attributes: {
        canonicalTitle: string;
        posterImage: {
            large: string;
        };
        season: string;
    };
}

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const AnimeQuiz = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [choices, setChoices] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingProgress, setLoadingProgress] = useState<number>(0); // New state for loading progress
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [showCorrect, setShowCorrect] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [isQuizReady, setIsQuizReady] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const subtype = searchParams.get('subtype') || 'TV';
    const year = searchParams.get('year') || '2024';
    const season = searchParams.get('season') || 'winter';

    const questionVariants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.5,
            };
        },
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        exit: (direction: number) => {
            return {
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.5,
                transition: {
                    duration: 0.3,
                },
            };
        },
    };

    const [direction, setDirection] = useState(1);

    const handleNextQuestion = () => {
        setDirection(1);
        if (currentQuestionIndex < animeList.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // Shuffle the anime list and restart the quiz
            setAnimeList(shuffleArray([...animeList]));
            setCurrentQuestionIndex(0);
        }
        setSelectedChoice(null);
        setIsLocked(false);
        setShowCorrect(false);
    };

    useEffect(() => {
        const fetchAllAnimeData = async () => {
            let allAnime: Anime[] = [];
            let page = 0;
            let hasMore = true;

            // Fetch the total count of anime
            const initialResponse = await fetch(
                `https://kitsu.io/api/edge/anime?filter[seasonYear]=${year}&filter[season]=${season}&filter[subtype]=${subtype}&page[limit]=1`
            );
            const initialData = await initialResponse.json();
            const totalCount = initialData.meta.count;
            const pageLimit = 20;
            const totalPages = Math.ceil(totalCount / pageLimit);

            while (hasMore) {
                const response = await fetch(
                    `https://kitsu.io/api/edge/anime?filter[seasonYear]=${year}&filter[season]=${season}&filter[subtype]=${subtype}&page[limit]=${pageLimit}&page[offset]=${page * pageLimit}`
                );
                const data = await response.json();
                if (data.data.length === 0) {
                    hasMore = false;
                } else {
                    allAnime = allAnime.concat(data.data);
                    page++;
                    const progress = Number(Number((Math.min((page / totalPages) * 100, 100))).toFixed(2));
                    setLoadingProgress(progress); // Update loading progress
                }
            }

            setAnimeList(shuffleArray(allAnime)); // Shuffle the list after fetching
            setLoading(false);
        };

        fetchAllAnimeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loading && animeList.length > 0) {
            const currentAnime = animeList[currentQuestionIndex];
            const filteredAnimeList = animeList.filter(
                (anime) => anime.attributes.canonicalTitle !== currentAnime.attributes.canonicalTitle
            );
            const randomChoices: string[] = [];

            while (randomChoices.length < 3) {
                const randomIndex = getRandomInt(filteredAnimeList.length);
                const randomAnime = filteredAnimeList[randomIndex];
                if (!randomChoices.includes(randomAnime.attributes.canonicalTitle)) {
                    randomChoices.push(randomAnime.attributes.canonicalTitle);
                }
            }
            randomChoices.push(currentAnime.attributes.canonicalTitle);
            setChoices(shuffleArray(randomChoices));
            setIsImageLoaded(false);
            setIsQuizReady(true);
        }
    }, [currentQuestionIndex, loading, animeList]);

    const handleChoiceClick = (choice: string) => {
        if (!isLocked) {
            setSelectedChoice(choice);
            setIsLocked(true);

            if (choice === animeList[currentQuestionIndex].attributes.canonicalTitle) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            } else {
                setShowCorrect(true);
            }

            setTimeout(() => {
                handleNextQuestion();
            }, 3000); // 3 seconds delay
        }
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true); // Set to true when the image has loaded
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 p-4 flex flex-col items-center justify-center">
            {/* Anime-style header */}
            <nav className="bg-transparent fixed w-full top-0 z-10">
                <div className="bg-opacity-70 bg-black backdrop-blur-md text-sm font-bold py-4 mb-3 container mx-auto flex items-center justify-center relative">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-4"
                    >
                        <FaArrowLeftLong
                            className="text-white text-2xl cursor-pointer"
                            onClick={() => router.back()}
                        />
                    </motion.div>
                    <h1 className="text-white text-2xl font-extrabold font-anime">TomiSakae</h1>
                </div>
            </nav>

            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex flex-col justify-center items-center'
                >
                    <p className="font-bold text-2xl mb-4 text-white font-anime">Trắc Nghiệm Anime</p>
                    <div className='border-2 border-white rounded-full w-[90vw] max-w-md overflow-hidden'>
                        <motion.div
                            className="bg-gradient-to-r from-pink-500 to-yellow-500 h-4 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                    </div>
                    <p className="text-white mt-2 text-lg">{loadingProgress}%</p>
                    <FaSpinner className="animate-spin text-white text-4xl mt-4" />
                </motion.div>
            ) : (
                animeList.length > 0 && (
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            custom={direction}
                            variants={questionVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="text-center text-white max-w-md w-full mt-16 mb-12"
                        >
                            <p className="font-bold text-2xl mb-4 font-anime">Trắc Nghiệm Anime</p>
                            {/* Anime poster with frame */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-72 h-auto mx-auto rounded-lg shadow-lg overflow-hidden border-4 border-yellow-300"
                            >
                                <Image
                                    src={animeList[currentQuestionIndex].attributes.posterImage.large}
                                    alt={animeList[currentQuestionIndex].attributes.canonicalTitle}
                                    width={550}
                                    height={780}
                                    className="w-full h-auto rounded-lg"
                                    onLoad={handleImageLoad}
                                />
                                {!isImageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <FaSpinner className="animate-spin text-white text-4xl" />
                                    </div>
                                )}
                            </motion.div>
                            {isImageLoaded && isQuizReady && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-1 gap-4 mt-8"
                                >
                                    {choices.map((choice, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={classNames(
                                                'text-white p-3 rounded-lg border-2 border-white bg-opacity-20 backdrop-blur-md transition-all duration-300 font-anime',
                                                {
                                                    'bg-green-500 border-green-300': (selectedChoice === choice && choice === animeList[currentQuestionIndex].attributes.canonicalTitle) || (showCorrect && choice === animeList[currentQuestionIndex].attributes.canonicalTitle),
                                                    'bg-red-500 border-red-300': selectedChoice === choice && choice !== animeList[currentQuestionIndex].attributes.canonicalTitle,
                                                    'hover:bg-white hover:text-purple-900': !isLocked,
                                                    'cursor-not-allowed opacity-50': isLocked,
                                                }
                                            )}
                                            onClick={() => handleChoiceClick(choice)}
                                            disabled={isLocked}
                                        >
                                            {choice}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )
            )}
            {/* Confetti effect for correct answers */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-yellow-300"
                                initial={{
                                    top: "50%",
                                    left: "50%",
                                    scale: 0,
                                }}
                                animate={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    scale: [0, 1, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: Math.random() * 0.2,
                                }}
                            >
                                <FaStar />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const Quiz = () => {
    return (
        <Suspense>
            <AnimeQuiz />
        </Suspense>
    );
}

export default Quiz;
