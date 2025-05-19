// components/Live2DModel.tsx
'use client'
import { useEffect, useState, Suspense, useRef } from 'react';
import Script from 'next/script';
import * as PIXI from 'pixi.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoArrowLeft } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { LiaRandomSolid } from "react-icons/lia";
import { motion, AnimatePresence } from 'framer-motion';

type JsonData = {
    Version: number;
    Name: string;
    FileReferences: {
        Moc: string;
        Textures: string[];
        DisplayInfo: null | string;
        Physics: string;
        Motions: {
            [key: string]: [
                {
                    File: string;
                }
            ];
        };
        Expressions: any[];
    };
    Groups: {
        Target: string;
        Name: string;
        Ids: string[];
    }[];
};

interface Meta {
    Duration: number;
}

interface JsonDataMotion {
    Meta: Meta;
}
declare global {
    interface Window {
        PIXI: typeof PIXI;
    }
}

interface HitArea {
    Name: string;
    Motion: string;
}

const Live2DModelComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const modelRef = useRef(null);  // Khai báo một biến tham chiếu useRef
    const modelId = searchParams.get('id') || '';
    const [hitAreas, setHitAreas] = useState<HitArea[]>([]);
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [scaleModel, setScaleModel] = useState(0.1);
    const [isLoadModel, setIsLoadModel] = useState(false);
    const [changeBackGround, setChangeBackGround] = useState('');
    const [motions, setMotions] = useState<string[]>([]);
    const [isPlayOpen, setIsPlayOpen] = useState(false);
    const [isPlayMotion, setIsPlayMotion] = useState(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [motionFiles, setMotionFiles] = useState<{ [key: string]: string[] }>({});
    // Ref để giữ track các giá trị elapsedTime
    const lastTimeRef = useRef<number>(0);
    const [isPlayRandom, setIsPlayRandom] = useState(false);
    const [isStartMotion, setIsStartMotion] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    useEffect(() => {
        window.PIXI = PIXI;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaleFactor = 1.0; // Adjust this value as needed
        PIXI.GRAPHICS_CURVES.adaptive = false;
        PIXI.settings.ANISOTROPIC_LEVEL = 0;
        PIXI.settings.RESOLUTION = devicePixelRatio;
        PIXI.settings.ROUND_PIXELS = true;
        const app = new PIXI.Application({
            view: document.getElementById('canvas') as HTMLCanvasElement,
            width: window.innerWidth * scaleFactor,
            height: window.innerHeight * scaleFactor,
            autoStart: true,
            resizeTo: window,
            antialias: true,
            autoDensity: true,
            resolution: devicePixelRatio,
            powerPreference: 'high-performance',
            backgroundAlpha: 0,
        });

        const loadLive2DModel = async () => {
            const { Live2DModel, MotionPreloadStrategy } = await import('pixi-live2d-display');
            const model = await Live2DModel.from(`/live2d/steam_models/${modelId}/character/model0.json`, { motionPreload: MotionPreloadStrategy.IDLE });
            const res = await fetch(`/live2d/steam_models/${modelId}/character/model0.json`);
            const jsonData: JsonData = await res.json();
            const motionTitles = Object.keys(jsonData.FileReferences.Motions);
            const motionFiles: { [key: string]: string[] } = {};
            motionTitles.forEach(title => {
                motionFiles[title] = jsonData.FileReferences.Motions[title].map(item => item.File);
            });
            // Đặt state cho motions với các giá trị File tương ứng
            setMotions(motionTitles);
            setMotionFiles(motionFiles);
            const response = await fetch(`/live2d/steam_models/${modelId}/character/model0.json`);
            const data = await response.json();
            setHitAreas(data.HitAreas);
            app.stage.addChild(model as unknown as PIXI.DisplayObject);
            (model as any).position.y = window.sessionStorage.getItem('modely' + modelId) || 0;
            (model as any).position.x = window.sessionStorage.getItem('modelx' + modelId) || 0;
            (model as any).scale.set(window.sessionStorage.getItem('scale' + modelId) || 0.1);
            setScaleModel(Number(window.sessionStorage.getItem('scale' + modelId)) || 0.1);
            const degrees = Number(window.sessionStorage.getItem('degrees' + modelId) || 0);
            const radians = degrees * (Math.PI / 180);
            // Áp dụng giá trị radians
            (model as any).rotation = radians;
            (model as any).interactive = true;
            (modelRef as any).current = model;
            (model as any).trackedPointers = {};
            setIsLoadModel(true);
            setIsModelLoaded(true); // Add this line
            setChangeBackGround(String(window.localStorage.getItem('backgrounds')) || '/background1.avif');
        };

        loadLive2DModel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive2DScriptLoaded]);

    useEffect(() => {
        if (isLoadModel) {
            (modelRef.current as any).on("hit", (hitArea: any) => {
                hitAreas.forEach((area) => {
                    if (hitArea.includes(area.Name)) {
                        (modelRef.current as any).motion(area.Motion);
                    }
                });
            });
        }
    }, [isLoadModel, hitAreas]);

    useEffect(() => {
        if (window.sessionStorage.getItem('reload') == 'true') {
            window.sessionStorage.setItem('reload', 'false');
            window.location.reload();
        }
        window.sessionStorage.setItem('reload', 'false');
    }, []);

    interface FileResult {
        selectedFile: string; // Tên file được chọn
        randomIndex: number; // Chỉ số ngẫu nhiên đã chọn
    }

    // Hàm chuyển đổi mảng tên file thành mảng đối tượng { File: string }
    const convertToFileObjects = (files: string[]): { File: string }[] => {
        return files.map(fileName => ({ File: fileName }));
    };

    // Hàm chọn file ngẫu nhiên và trả về cả tên file và chỉ số ngẫu nhiên
    const getRandomFile = (files: { File: string }[]): { File: string, index: number } => {
        const randomIndex = Math.floor(Math.random() * files.length);
        return {
            File: files[randomIndex].File,
            index: randomIndex
        };
    };

    // Hàm lấy file cho tiêu đề và chỉ số ngẫu nhiên
    const getFileForTitle = (title: string): FileResult => {
        const fileNames = motionFiles[title];
        if (!fileNames) {
            throw new Error(`No files found for title: ${title}`);
        }
        const fileObjects = convertToFileObjects(fileNames); // Chuyển đổi tên file thành đối tượng { File: string }
        const { File: selectedFile, index: randomIndex } = getRandomFile(fileObjects);
        return {
            selectedFile,
            randomIndex
        };
    };

    const setPlayMotions = async (title: string) => {
        setIsPlayOpen(false);
        setElapsedTime(0);
        if (motionFiles[title] && motionFiles[title].length > 0) {
            // Lấy đường dẫn tới file đầu tiên (hoặc bạn có thể chọn file cụ thể nếu cần)
            const basePath = `/live2d/steam_models/${modelId}/character/model0.json`;
            const { selectedFile, randomIndex } = getFileForTitle(title);
            const fileName = selectedFile;
            const basePathWithoutFile = basePath.slice(0, basePath.lastIndexOf('/') + 1); // Cắt bỏ phần cuối của basePath
            const filePath = `${basePathWithoutFile}${fileName}`; // Tạo đường dẫn mới
            // Tải file nếu cần
            const res = await fetch(filePath);
            if (res.ok) {
                const jsonData: JsonDataMotion = await res.json();
                setDuration(jsonData.Meta.Duration);
                setIsPlayMotion(true);
            } else {
                console.error('Failed to fetch file:', filePath);
            }

            // Gọi method motion từ modelRef
            if (modelRef.current) {
                (modelRef.current as any).motion(title, randomIndex);
            } else {
                console.error('Model reference is not available');
            }
        } else {
            console.error('Motion title not found in motionFiles:', title);
        }
    }

    useEffect(() => {
        let animationFrameId: number;

        const updateTime = (timestamp: number) => {
            if (isPlayMotion && duration !== null) {
                const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Chuyển đổi ms thành giây
                lastTimeRef.current = timestamp;

                setElapsedTime(prevTime => {
                    if (prevTime + deltaTime >= duration) {
                        setIsPlayMotion(false);
                        return duration;
                    }
                    return prevTime + deltaTime;
                });

                animationFrameId = requestAnimationFrame(updateTime);
            }
        };

        if (isPlayMotion && duration !== null) {
            lastTimeRef.current = performance.now();
            animationFrameId = requestAnimationFrame(updateTime);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlayMotion, duration]);

    return (
        <>
            <Script
                src="/live2d/core/live2dcubismcore.min.js"
                strategy="beforeInteractive"
                onLoad={() => setIsLive2DScriptLoaded(true)}
            />
            <Script
                src="/live2d/core/live2d.min.js"
                strategy="beforeInteractive"
                onLoad={() => setIsLive2DScriptLoaded(true)}
            />

            <canvas id="canvas"
                style={{
                    backgroundImage: `url(${changeBackGround || '/background1.avif'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }} />

            {/* Start motion overlay */}
            {isModelLoaded && !isStartMotion && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer z-50"
                    onClick={() => {
                        setIsStartMotion(true);
                        (modelRef.current as any).motion('Start');
                    }}
                >
                    <div className="text-white text-2xl font-bold">Nhấn Để Tương Tác</div>
                </div>
            )}

            {/* Progress bar */}
            {isPlayMotion && !isPlayRandom && (
                <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                    <div className="text-sm font-medium">
                        {elapsedTime.toFixed(1)}s / {duration?.toFixed(1)}s
                    </div>
                </div>
            )}

            {/* Motion selection panel */}
            <AnimatePresence>
                {isPlayOpen && !isPlayRandom && !isPlayMotion && (
                    <motion.div
                        className="fixed bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Chạy Chuyển Động</h3>
                            <LiaRandomSolid
                                className="text-xl cursor-pointer hover:text-[#9C4BEE] transition-colors"
                                onClick={() => {
                                    (modelRef.current as any).internalModel.motionManager.groups.idle = 'Animation';
                                    setIsPlayRandom(true);
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto">
                            {motions.map((title, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-2 text-sm rounded-full bg-white text-black hover:bg-[#9C4BEE] hover:text-white transition-colors"
                                    onClick={() => setPlayMotions(title)}
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Control buttons */}
            {!isPlayMotion && !isPlayRandom && (
                <div className="fixed inset-x-0 top-0 flex justify-between items-start p-4">
                    <GoArrowLeft
                        className="text-2xl text-white cursor-pointer hover:text-[#9C4BEE] transition-colors"
                        onClick={() => router.push('/live2d')}
                    />
                    <CiSettings
                        className="text-2xl text-white cursor-pointer hover:text-[#9C4BEE] transition-colors"
                        onClick={() => {
                            router.push(`/live2d/show/edit/?id=${modelId}`);
                            window.sessionStorage.setItem('reload', 'true');
                        }}
                    />
                </div>
            )}

            {/* Toggle motion panel button */}
            {!isPlayMotion && !isPlayRandom && (
                <button
                    className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                    onClick={() => setIsPlayOpen((prev) => !prev)}
                >
                    {isPlayOpen ? <MdExpandMore className="text-2xl" /> : <MdExpandLess className="text-2xl" />}
                </button>
            )}
        </>
    );
};

const Show = () => {
    return (
        <Suspense>
            <Live2DModelComponent />
        </Suspense>
    );
}

export default Show;
