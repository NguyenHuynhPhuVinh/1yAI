// components/Live2DModel.tsx
'use client'
import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import * as PIXI from 'pixi.js';
import { useRouter } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import { GrPowerReset } from "react-icons/gr";
import { Live2d } from '../../../components/Live2D';
declare global {
    interface Window {
        PIXI: typeof PIXI;
    }
}

const Live2DModelComponent = () => {
    const router = useRouter();
    const modelRef = useRef(null);  // Khai báo một biến tham chiếu useRef
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [scaleModel, setScaleModel] = useState(0.1);
    const [changeBackGround, setChangeBackGround] = useState('');

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
                    window.localStorage.setItem('modelx', model.position.x);
                    window.localStorage.setItem('modely', model.position.y);
                }
            });
            model.on("pointerupoutside", () => (model.dragging = false));
            model.on("pointerup", () => (model.dragging = false));
        }

        const loadLive2DModel = async () => {
            const { Live2DModel, MotionPreloadStrategy } = await import('pixi-live2d-display');
            const model = await Live2DModel.from(window.localStorage.getItem('model') || '/live2d/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json', { motionPreload: MotionPreloadStrategy.IDLE });
            app.stage.addChild(model as unknown as PIXI.DisplayObject);
            const id = parseInt(window.localStorage.getItem('modelid') || '1', 10);
            const { setX, setY, setScale } = Live2d(id);
            (model as any).position.y = window.localStorage.getItem('modely') || setY;
            (model as any).position.x = window.localStorage.getItem('modelx') || setX;
            (model as any).scale.set(window.localStorage.getItem('scale') || setScale);
            setScaleModel(Number(window.localStorage.getItem('scale')) || setScale);
            (model as any).interactive = true;
            (model as any).trackedPointers = {};
            (modelRef as any).current = model;
            draggable(model);
            setChangeBackGround(String(window.localStorage.getItem('background')) || '/background1.avif');
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

    const upScale = () => {
        (modelRef as any).current.scale.set(parseFloat((scaleModel + 0.01).toFixed(2)));
        setScaleModel(parseFloat((scaleModel + 0.01).toFixed(2)));
    }

    const downScale = () => {
        (modelRef as any).current.scale.set(parseFloat((scaleModel - 0.01).toFixed(2)));
        setScaleModel(parseFloat((scaleModel - 0.01).toFixed(2)));
    }

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

            <canvas id="canvas"
                style={{
                    backgroundImage: `url(${changeBackGround || '/background1.avif'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }} />
            <div className="relative">
                <div className="fixed flex flex-col justify-center items-center top-4 right-4 opacity-50">
                    <div className="">
                        <AiOutlineClose
                            className="text-xl text-white cursor-pointer"
                            onClick={() => {
                                window.localStorage.setItem('scale', String(scaleModel));
                                router.back();
                                window.sessionStorage.setItem('reload', 'true');
                            }}
                        />
                    </div>
                    <div className="mt-6">
                        <GrPowerReset
                            className="text-xl text-white cursor-pointer"
                            onClick={resetPage}
                        />
                    </div>
                </div>
                <div className="fixed top-4 items-center opacity-50 right-4 mx-8 p-2 bg-gray-800 rounded-md flex space-x-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={upScale}>+</button>
                    <div className="text-white font-bold">{scaleModel}</div>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={downScale}>-</button>
                </div>
            </div>
        </>
    );
};

export default Live2DModelComponent;
