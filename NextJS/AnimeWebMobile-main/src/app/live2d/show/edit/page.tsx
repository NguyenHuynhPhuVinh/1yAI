// components/Live2DModel.tsx
'use client'
import { useEffect, useState, useRef, Suspense } from 'react';
import Script from 'next/script';
import * as PIXI from 'pixi.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import { GrPowerReset } from "react-icons/gr";
import { TbBackground } from "react-icons/tb";
import backGroundData from "../../../../components/BackGround";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
    interface Window {
        PIXI: typeof PIXI;
    }
}

const Live2DModelComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const modelId = searchParams.get('id') || '';
    const modelRef = useRef(null);  // Khai báo một biến tham chiếu useRef
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [scaleModel, setScaleModel] = useState(0.1);
    const [changeBackGround, setChangeBackGround] = useState('');
    const [isChangeBackGround, setIsChangeBackGround] = useState(false);
    const [editModeBackGround, setEditModeBackGround] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [angle, setAngle] = useState(0); // Góc theo độ
    const [isEditingScale, setIsEditingScale] = useState(false); // Quản lý việc hiển thị textarea
    const [isEditingAngle, setIsEditingAngle] = useState(false); // Quản lý việc hiển thị textarea
    const [textEditingScale, setTextEditingScale] = useState("0.1"); // Quản lý việc hiển thị textarea
    const [textEditingAngle, setTextEditingAngle] = useState("0"); // Quản lý việc hiển thị textarea

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

        const draggable = (model: any) => {
            model.buttonMode = true;
            model.on("pointerdown", (e: any) => {
                model.dragging = true;
                model._pointerX = e.data.global.x - model.x;
                model._pointerY = e.data.global.y - model.y;
            });
            model.on("pointermove", (e: any) => {
                if (model.dragging) {
                    model.position.x = e.data.global.x - model._pointerX;
                    model.position.y = e.data.global.y - model._pointerY;
                    window.sessionStorage.setItem('modelx' + modelId, model.position.x);
                    window.sessionStorage.setItem('modely' + modelId, model.position.y);
                }
            });
            model.on("pointerupoutside", () => (model.dragging = false));
            model.on("pointerup", () => (model.dragging = false));
        }

        const loadLive2DModel = async () => {
            const { Live2DModel, MotionPreloadStrategy } = await import('pixi-live2d-display');
            const model = await Live2DModel.from(`/live2d/steam_models/${modelId}/character/model0.json`, { motionPreload: MotionPreloadStrategy.IDLE });
            app.stage.addChild(model as unknown as PIXI.DisplayObject);
            (model as any).position.y = window.sessionStorage.getItem('modely' + modelId) || 0;
            (model as any).position.x = window.sessionStorage.getItem('modelx' + modelId) || 0;
            (model as any).scale.set(window.sessionStorage.getItem('scale' + modelId) || 0.1);
            setScaleModel(Number(window.sessionStorage.getItem('scale' + modelId)) || 0.1);
            const degrees = Number(window.sessionStorage.getItem('degrees' + modelId) || 0);
            const radians = degrees * (Math.PI / 180);
            // Áp dụng giá trị radians
            (model as any).rotation = radians;
            setAngle(degrees);
            (model as any).interactive = true;
            (model as any).trackedPointers = {};
            (modelRef as any).current = model;
            draggable(model);
            setChangeBackGround(String(window.localStorage.getItem('backgrounds')) || '/background1.avif');
        };

        loadLive2DModel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive2DScriptLoaded]);

    useEffect(() => {
        if (window.sessionStorage.getItem('reload') == 'true') {
            window.sessionStorage.setItem('reload', 'false');
            window.location.reload();
        }
        window.sessionStorage.setItem('reload', 'false');
    }, []);

    useEffect(() => {
        setTextEditingScale(String(scaleModel));
        setTextEditingAngle(String(angle));
    }, [scaleModel, angle])

    const upScale = () => {
        if (isEditingScale) {
            setIsEditingScale(false);
            (modelRef as any).current.scale.set(parseFloat((Number(textEditingScale)).toFixed(2)));
            setScaleModel(parseFloat((Number(textEditingScale)).toFixed(2)));
        }
        else {
            (modelRef as any).current.scale.set(parseFloat((scaleModel + 0.01).toFixed(2)));
            setScaleModel(parseFloat((scaleModel + 0.01).toFixed(2)));
        }
    }

    const downScale = () => {
        if (isEditingScale) {
            setIsEditingScale(false);
            (modelRef as any).current.scale.set(parseFloat((Number(textEditingScale)).toFixed(2)));
            setScaleModel(parseFloat((Number(textEditingScale)).toFixed(2)));
        }
        else {
            (modelRef as any).current.scale.set(parseFloat((scaleModel - 0.01).toFixed(2)));
            setScaleModel(parseFloat((scaleModel - 0.01).toFixed(2)));
        }
    }

    // Hàm để tăng góc
    const upAngle = () => {
        let newAngle = angle + 1; // Tăng góc lên 1 độ
        if (isEditingAngle) {
            setIsEditingAngle(false);
            newAngle = Number(textEditingAngle);
        }
        if (newAngle >= 360) {
            newAngle -= 360;
        }
        const radians = newAngle * (Math.PI / 180);
        (modelRef as any).current.rotation = radians;
        setAngle(newAngle);
    };

    // Hàm để giảm góc
    const downAngle = () => {
        let newAngle = angle - 1; // Giảm góc lên 1 độ
        if (isEditingAngle) {
            setIsEditingAngle(false);
            newAngle = Number(textEditingAngle);
        }
        if (newAngle <= -360) {
            newAngle += 360;
        }
        const radians = newAngle * (Math.PI / 180);
        (modelRef as any).current.rotation = radians;
        setAngle(newAngle);
    };

    const resetPage = () => {
        window.sessionStorage.removeItem('modely' + modelId);
        window.sessionStorage.removeItem('modelx' + modelId);
        window.sessionStorage.removeItem('scale' + modelId);
        window.sessionStorage.removeItem('degrees' + modelId);
        window.location.reload();
    }

    const toggleChangeBackGround = () => {
        setIsChangeBackGround(true);
    };

    const closeChangeBackGround = () => {
        setIsChangeBackGround(false);
        setEditModeBackGround(false);
    };

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
            <div className="relative">
                <div className="fixed top-0 right-0 bottom-0 bg-gray-800 bg-opacity-70 p-2 flex flex-col items-center justify-between w-16 sm:w-20">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Close button */}
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                            onClick={() => {
                                window.sessionStorage.setItem('scale' + modelId, String(scaleModel));
                                window.sessionStorage.setItem('degrees' + modelId, String(angle));
                                router.push(`/live2d/show/?id=${modelId}`);
                                window.sessionStorage.setItem('reload', 'true');
                            }}
                        >
                            <AiOutlineClose className="text-lg" />
                        </button>

                        {/* Scale control */}
                        <div className="flex flex-col items-center">
                            <label className="text-white text-xs mb-1">Tỷ lệ</label>
                            <div className="flex flex-col items-center space-y-1">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm w-full" onClick={upScale}>+</button>
                                <input
                                    type="text"
                                    className="bg-gray-700 text-white px-2 py-1 rounded w-full text-center text-sm"
                                    value={textEditingScale}
                                    onChange={(e) => setTextEditingScale(e.target.value)}
                                    onBlur={upScale}
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm w-full" onClick={downScale}>-</button>
                            </div>
                        </div>

                        {/* Angle control */}
                        <div className="flex flex-col items-center">
                            <label className="text-white text-xs mb-1">Góc</label>
                            <div className="flex flex-col items-center space-y-1">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm w-full" onClick={upAngle}>+</button>
                                <input
                                    type="text"
                                    className="bg-gray-700 text-white px-2 py-1 rounded w-full text-center text-sm"
                                    value={textEditingAngle}
                                    onChange={(e) => setTextEditingAngle(e.target.value)}
                                    onBlur={upAngle}
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm w-full" onClick={downAngle}>-</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        {/* Action buttons */}
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center justify-center w-full"
                            onClick={toggleChangeBackGround}
                        >
                            <TbBackground className="text-lg" />
                        </button>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded flex items-center justify-center w-full"
                            onClick={resetPage}
                        >
                            <GrPowerReset className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isChangeBackGround && (
                    <motion.div className={`fixed top-4 bottom-[10vh] h-[88vh] left-4 right-4 bg-[#333333] rounded-lg p-4 ${isChangeBackGround === true ? 'z-30' : '-z-30'}`}
                        initial={{ translateY: -25, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: 25, opacity: 0 }}
                        transition={{ duration: 0.25 }}>
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
                                                window.localStorage.setItem('backgrounds', url);
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
                                                window.localStorage.setItem('backgrounds', background.url);
                                                setChangeBackGround(background.url);
                                                closeChangeBackGround();
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Edit = () => {
    return (
        <Suspense>
            <Live2DModelComponent />
        </Suspense>
    );
}

export default Edit;
