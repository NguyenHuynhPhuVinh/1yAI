// components/Live2DModel.tsx
'use client'
import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import * as PIXI from 'pixi.js';
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FaExchangeAlt } from "react-icons/fa";
import { Live2d } from '../../../components/Live2D';
import { MdOutlineChangeCircle } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai';
import modelData from "../../../components/Live2D";
import Image from 'next/image';
import { CiPlay1 } from "react-icons/ci";
import { TbBackground } from "react-icons/tb";
import backGroundData from "../../../components/BackGround";
import { LiaRandomSolid } from "react-icons/lia";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

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

const Live2DModelComponent = () => {
    const router = useRouter();
    const modelRef = useRef(null);  // Khai báo một biến tham chiếu useRef
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [isChangeCharacter, setIsChangeCharacter] = useState(false);
    const [isLoadedLive2d, setIsLoadedLive2d] = useState(false);
    const [isOpacityOpen, setIsOpacityOpen] = useState(false);
    const [motions, setMotions] = useState<string[]>([]);
    const [isPlayOpen, setIsPlayOpen] = useState(false);
    const [isPlayMotion, setIsPlayMotion] = useState(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [motionFiles, setMotionFiles] = useState<{ [key: string]: string[] }>({});
    // Ref để giữ track các giá trị elapsedTime
    const lastTimeRef = useRef<number>(0);
    const [isChangeBackGround, setIsChangeBackGround] = useState(false);
    const [changeBackGround, setChangeBackGround] = useState('');
    const [isPlayRandom, setIsPlayRandom] = useState(false);
    const [editModeBackGround, setEditModeBackGround] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            const model = await Live2DModel.from(window.localStorage.getItem('model') || '/live2d/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json', { motionPreload: MotionPreloadStrategy.IDLE });
            const res = await fetch(window.localStorage.getItem('model') || '/live2d/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json');
            const jsonData: JsonData = await res.json();
            const motionTitles = Object.keys(jsonData.FileReferences.Motions);
            const motionFiles: { [key: string]: string[] } = {};
            motionTitles.forEach(title => {
                motionFiles[title] = jsonData.FileReferences.Motions[title].map(item => item.File);
            });
            // Đặt state cho motions với các giá trị File tương ứng
            setMotions(motionTitles);
            setMotionFiles(motionFiles);
            app.stage.addChild(model as unknown as PIXI.DisplayObject);
            const id = parseInt(window.localStorage.getItem('modelid') || '1', 10);
            const { setX, setY, setScale } = Live2d(id);
            (model as any).position.y = window.localStorage.getItem('modely') || setY;
            (model as any).position.x = window.localStorage.getItem('modelx') || setX;
            (model as any).scale.set(window.localStorage.getItem('scale') || setScale);
            (model as any).interactive = true;
            (model as any).trackedPointers = {};
            // Gán giá trị model vào biến tham chiếu useRef
            (modelRef as any).current = model;

            setChangeBackGround(String(window.localStorage.getItem('background')) || '/background1.avif');

            (model as any).on("hit", (hitAreas: any) => {
                if (hitAreas.includes("TouchSpecial")) {
                    (model as any).motion("TapTouchSpecial");
                }

                if (hitAreas.includes("TouchHead")) {
                    (model as any).motion("TapTouchHead");
                }
                if (hitAreas.includes("TouchBody")) {
                    (model as any).motion("TapTouchBody");
                }
                if (hitAreas.includes("Face")) {
                    (model as any).motion("TapFace");
                }
                if (hitAreas.includes("panci")) {
                    (model as any).motion("Tappanci");
                }
                if (hitAreas.includes("damuzi")) {
                    (model as any).motion("Tapdamuzi");
                }
            });
            setIsLoadedLive2d(true);
        };

        loadLive2DModel();
    }, [isLive2DScriptLoaded]);

    useEffect(() => {
        if (window.sessionStorage.getItem('reload') == 'true') {
            window.sessionStorage.setItem('reload', 'false');
            window.location.reload();
        }
        window.sessionStorage.setItem('reload', 'false');
    }, []);

    const toggleChangeCharacter = () => {
        setIsChangeCharacter(true);
        setIsOpacityOpen(true);
    };

    const closeChangeCharacter = () => {
        setIsChangeCharacter(false);
        setIsOpacityOpen(false);
    };

    const toggleChangeBackGround = () => {
        setIsChangeBackGround(true);
        setIsOpacityOpen(true);
    };

    const closeChangeBackGround = () => {
        setIsChangeBackGround(false);
        setEditModeBackGround(false);
        setIsOpacityOpen(false);
    };

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
            const basePath = window.localStorage.getItem('model') || '/live2d/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json';
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

    const resetPage = () => {
        window.localStorage.removeItem('modely');
        window.localStorage.removeItem('modelx');
        window.localStorage.removeItem('scale');
        window.location.reload();
    }

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

            <style jsx global>{`
                .gradient-background {
                    background: rgba(3, 122, 222, 0.5) linear-gradient(to bottom right, rgba(3, 122, 222, 0.5), rgba(3, 229, 183, 0.5));
                }
            `}</style>
            <canvas id="canvas" className={`${isOpacityOpen ? 'opacity-50' : ''}`}
                style={{
                    backgroundImage: `url(${changeBackGround || '/background1.avif'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }} />
            {isPlayMotion &&
                <div
                    className="fixed bottom-0 left-0 h-[1px] bg-[#9C4BEE] z-50"
                    style={{
                        width: `${(elapsedTime / (duration || 1)) * 100}%`,
                    }}
                ></div>
            }
            {isPlayOpen &&
                <div className={`fixed flex justify-center bg-[#333333] items-center text-sm bottom-[2em] left-[50%] w-[100%] transform -translate-x-1/2 py-2 px-4 text-white ${isOpacityOpen ? 'opacity-50' : ''}`}>
                    <div className='pt-2'>
                        <div className='h-[20vh] overflow-auto'>
                            {motions.map((title, index) => (
                                <button key={index}
                                    className="px-2 py-1 my-2 mx-2 text-xs rounded-lg font-bold bg-white text-black" onClick={() => setPlayMotions(title)}>{title}</button>
                            ))}
                        </div>
                    </div>
                </div>
            }
            {!isPlayMotion && !isPlayRandom &&
                <div className={`fixed flex justify-end bg-[#333333] items-center  text-sm bottom-0 left-[50%] w-[100%] transform -translate-x-1/2 py-2 px-4 text-white ${isOpacityOpen ? 'opacity-50' : ''}`}>
                    <LiaRandomSolid className="text-xl font-bold cursor-pointer me-5"
                        onClick={() => {
                            (modelRef.current as any).internalModel.motionManager.groups.idle = 'Animation';
                            setIsPlayRandom(true);
                        }} />
                    <CiPlay1
                        className="text-xl font-bold cursor-pointer me-5"
                        onClick={() => {
                            setIsPlayOpen((prev) => !prev);
                        }}
                    />
                    <MdOutlineChangeCircle className="text-xl font-bold cursor-pointer me-5" onClick={toggleChangeCharacter} />
                    <TbBackground className="text-xl font-bold cursor-pointer me-5" onClick={toggleChangeBackGround} />
                    <FaExchangeAlt className="text-lg font-bold cursor-pointer me-5"
                        onClick={() => {
                            router.back();
                            window.sessionStorage.setItem('reload', 'true');
                        }} />
                    <FaEdit className="text-lg font-bold cursor-pointer" onClick={() => {
                        router.push("/chat/edit");
                        window.sessionStorage.setItem('reload', 'true');
                    }} />
                </div>
            }
            {isChangeCharacter && (
                <div className={`fixed top-4 bottom-[10vh] h-[88vh] left-4 right-4 bg-[#333333] rounded-lg p-4 ${isChangeCharacter === true ? 'z-30' : '-z-30'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-white">Đổi Nhân Vật</h2>
                        <AiOutlineClose className="text-xl text-white cursor-pointer" onClick={closeChangeCharacter} />
                    </div>
                    <div className="h-[90%] overflow-auto">
                        <div className='grid grid-cols-2'>
                            {modelData.models.map((model: any) => (
                                model.img &&
                                <div key={model.modelid}>
                                    <div className='border rounded-t-2xl mx-1 my-2'>
                                        <p className='bg-white text-center text-sm font-[600] rounded-t-2xl p-1'>{model.modelname}</p>
                                        <Image
                                            src={model.img}
                                            alt={model.modelname}
                                            width={192}
                                            height={256}
                                            className="h-auto bg-white cursor-pointer"
                                            onClick={() => {
                                                window.localStorage.setItem('model', model.model);
                                                window.localStorage.setItem('modelname', model.modelname);
                                                window.localStorage.setItem('modelid', model.modelid);
                                                resetPage();
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {isChangeBackGround && (
                <div className={`fixed top-4 bottom-[10vh] h-[88vh] left-4 right-4 bg-[#333333] rounded-lg p-4 ${isChangeBackGround === true ? 'z-30' : '-z-30'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-white">Đổi Ảnh Nền</h2>
                        <div className='flex justify-center items-center'>
                            {!editModeBackGround ?
                                <FaEdit className="text-md text-white cursor-pointer me-5" onClick={() => {
                                    setEditModeBackGround(true);
                                }} />
                                : <div className='flex justify-center items-center'>
                                    <textarea
                                        placeholder='Nhập URL...'
                                        autoFocus
                                        className="resize-none border-none focus:outline-none rounded-md overflow-x-auto overflow-y-hidden px-2 bg-[#333333] text-white h-[1.5em] w-[30vw] me-2 whitespace-nowrap"
                                        rows={1} // Đặt số hàng để hiển thị 1 hàng
                                        ref={textareaRef} // Tham chiếu đến textarea
                                    />
                                    <IoCheckmarkDoneCircle onClick={() => {
                                        if (textareaRef.current) {
                                            // Lấy giá trị từ textarea
                                            const url = textareaRef.current.value;
                                            // Lưu giá trị URL vào localStorage
                                            window.localStorage.setItem('background', url);
                                            setChangeBackGround(url);
                                            closeChangeBackGround();
                                        }
                                    }} className="font-bold text-lg cursor-pointer text-white mx-2" />
                                </div>}
                            <AiOutlineClose className="text-xl text-white cursor-pointer" onClick={closeChangeBackGround} />
                        </div>
                    </div>
                    <div className="h-[90%] overflow-auto">
                        <div className='grid grid-cols-2'>
                            {backGroundData.backgrounds.map((background: any, index) => (
                                <div key={index} className='mx-1 my-1'>
                                    <Image
                                        src={background.url}
                                        alt={"Ảnh Nền"}
                                        width={1920}
                                        height={1080}
                                        className="w-[100%] h-auto cursor-pointer"
                                        onClick={() => {
                                            window.localStorage.setItem('background', background.url);
                                            setChangeBackGround(background.url);
                                            closeChangeBackGround();
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Live2DModelComponent;
