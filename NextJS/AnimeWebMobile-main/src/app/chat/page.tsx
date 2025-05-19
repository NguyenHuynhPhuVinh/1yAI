// components/Live2DModel.tsx
'use client'
import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import * as PIXI from 'pixi.js';
import { generateChatResponse } from '@/components/GeminiAPI';
import { IoMdSend } from 'react-icons/io';
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import { MdHistory } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai';
import { FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FaExchangeAlt } from "react-icons/fa";
import { Live2d } from '../../components/Live2D';
import { MdOutlineChangeCircle } from "react-icons/md";
import modelData from "../../components/Live2D";
import Image from 'next/image';
import { TbBackground } from "react-icons/tb";
import backGroundData from "../../components/BackGround";
declare global {
    interface Window {
        PIXI: typeof PIXI;
    }
}

const Live2DModelComponent = () => {
    const router = useRouter();
    const modelRef = useRef(null);  // Khai báo một biến tham chiếu useRef
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isChangeType, setIsChangeType] = useState(false);
    const [textAnimation, setTextAnimation] = useState<string[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isChangeCharacter, setIsChangeCharacter] = useState(false);
    const [isChangeBackGround, setIsChangeBackGround] = useState(false);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [isTrashRemove, setIsTrashRemove] = useState(false);
    const [isOpacityOpen, setIsOpacityOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('User');
    const [modelName, setModelName] = useState('');
    const [changeBackGround, setChangeBackGround] = useState('');
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
            let storedChatHistory = JSON.parse(window.localStorage.getItem('chatHistory') || '[]');
            setChatHistory(storedChatHistory);
            if (storedChatHistory.length > 0) {
                setOutputText(storedChatHistory[storedChatHistory.length - 1].parts[0].text);
            } else {
                setOutputText("Nhấn vào nút gửi để nhập tin nhắn!");
            }
            setUsername(window.localStorage.getItem('user') || 'User');
            app.stage.addChild(model as unknown as PIXI.DisplayObject);
            const id = parseInt(window.localStorage.getItem('modelid') || '1', 10);
            const { setX, setY, setScale } = Live2d(id);
            (model as any).position.y = window.localStorage.getItem('modely') || setY;
            (model as any).position.x = window.localStorage.getItem('modelx') || setX;
            (model as any).scale.set(window.localStorage.getItem('scale') || setScale);
            (model as any).interactive = true;
            (model as any).trackedPointers = {};
            setModelName(window.localStorage.getItem('modelname') || 'HMS Abercrombie (F109)');
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

    const handleToggleInput = () => {
        setIsTyping((prev) => !prev);
        setInputText('');
        setOutputText('');
    };

    const handleRemoveHistory = () => {
        window.localStorage.removeItem('chatHistory');
        setOutputText("Nhấn vào nút gửi để nhập tin nhắn!");
        closeTrash();
        setIsOpacityOpen(true);
        setIsTrashRemove(true);
        setChatHistory([]);
        handleToggleInput();
        setIsTyping(true);
    };

    const handleSend = async () => {
        if (inputText.trim() !== '') {
            (modelRef as any).current.motion('Animation');
            setIsChangeType(true);
            setOutputText('...');
            setTextAnimation('...'.split('')); // Hiển thị hiệu ứng với "..."
            setIsTyping(false);
            const response = await generateChatResponse(inputText);
            setOutputText(response);

            // Thêm phần tử mới với chuỗi người dùng nhập vào
            let newUserEntry = { parts: [{ text: inputText }], role: "user" };
            let updatedChatHistory = [...chatHistory, newUserEntry];

            // Thêm phần tử mới với phản hồi của model
            let newModelEntry = { parts: [{ text: response }], role: "model" };
            updatedChatHistory = [...updatedChatHistory, newModelEntry];
            setChatHistory(updatedChatHistory);
            setIsChangeType(false);
            setInputText('');
        }
    };

    const handleDoubleClick = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false); // Đặt editMode thành false khi lưu
        window.localStorage.setItem('user', username);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUsername(event.target.value);
        window.localStorage.setItem('user', username);
    };

    const toggleHistory = () => {
        setIsHistoryOpen((prev) => !prev);
        setIsOpacityOpen(true);
    };

    const toggleChangeCharacter = () => {
        setIsChangeCharacter(true);
        setIsOpacityOpen(true);
    };

    const toggleChangeBackGround = () => {
        setIsChangeBackGround(true);
        setIsOpacityOpen(true);
    };

    const toggleTrash = () => {
        setIsTrashOpen((prev) => !prev);
        setIsOpacityOpen(true);
    };

    const closeHistory = () => {
        setIsHistoryOpen(false);
        setIsOpacityOpen(false);
    };

    const closeChangeCharacter = () => {
        setIsChangeCharacter(false);
        setIsOpacityOpen(false);
    };

    const closeChangeBackGround = () => {
        setIsChangeBackGround(false);
        setEditModeBackGround(false);
        setIsOpacityOpen(false);
    };

    const closeTrash = () => {
        setIsTrashOpen(false);
        setIsOpacityOpen(false);
    };

    const closeTrashRemove = () => {
        setIsTrashRemove(false);
        setIsOpacityOpen(false);
    };

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
            <div className={`fixed gradient-background text-sm bottom-[8em] left-[50%] w-[95%] transform -translate-x-1/2 rounded-lg pt-2 pb-2 px-2 text-white ${isOpacityOpen ? 'opacity-50' : ''}`}>
                <div className="px-2 font-bold">
                    {outputText ? (
                        <h6>{modelName}</h6>
                    ) : (
                        editMode ? (
                            <div className="flex items-center">
                                <textarea
                                    value={username}
                                    onChange={handleChange}
                                    autoFocus
                                    className="resize-none border-none focus:outline-none rounded-md px-2 bg-[#333333] text-white h-[1.5em] w-[30vw] me-2"
                                />
                                <IoCheckmarkDoneCircle onClick={handleSave} className="font-bold text-lg cursor-pointer text-[#333333]" />
                            </div>
                        ) : (
                            <h6 onDoubleClick={handleDoubleClick}>{username}</h6>
                        )
                    )}
                </div>
                <div className="bg-[#333333] font-[500] rounded-lg h-[7.2em] mt-2 text-white py-2 px-4 relative overflow-auto">
                    {outputText ? (
                        outputText === "..." ? (
                            <div className="mb-4">
                                {textAnimation.map((el, i) => (
                                    <motion.span
                                        className="text-2xl"
                                        initial={{ y: 0, opacity: 0, }}
                                        animate={{ y: [-5, 0], opacity: 1 }}
                                        transition={{
                                            duration: 0.75,
                                            delay: i / 10,
                                            repeat: Infinity,
                                        }}
                                        key={i}
                                    >
                                        {el}
                                    </motion.span>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-4">
                                <TypeAnimation
                                    sequence={[outputText
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    cursor={false}
                                    style={{ fontSize: "14px", display: 'inline-block' }}
                                />
                            </div>
                        )
                    ) : (
                        <textarea
                            className={`w-full h-full bg-transparent resize-none outline-none ${isTyping ? 'block' : 'hidden'}`}
                            placeholder="Nhập nội dung vào đây..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    )}
                    {isChangeType === false ? (
                        <IoMdSend
                            className="text-white fixed bottom-4 right-4 text-xl cursor-pointer"
                            onClick={isTyping ? handleSend : handleToggleInput}
                        />
                    ) : (<span></span>)}
                </div>
            </div>
            <div className={`fixed flex justify-end items-center gradient-background text-sm bottom-[5.2em] left-[50%] w-[95%] transform -translate-x-1/2 rounded-lg py-2 px-4 text-white ${isOpacityOpen ? 'opacity-50' : ''}`}>
                <MdOutlineChangeCircle className="text-xl font-bold cursor-pointer me-5" onClick={toggleChangeCharacter} />
                <TbBackground className="text-xl font-bold cursor-pointer me-5" onClick={toggleChangeBackGround} />
                <FaExchangeAlt className="text-lg font-bold cursor-pointer me-5" onClick={() => {
                    router.push("/chat/show");
                    window.sessionStorage.setItem('reload', 'true');
                }} />
                <FaEdit className="text-lg font-bold cursor-pointer me-5" onClick={() => {
                    router.push("/chat/edit");
                    window.sessionStorage.setItem('reload', 'true');
                }} />
                <FaTrashAlt className="text-lg font-bold cursor-pointer me-5" onClick={toggleTrash} />
                <MdHistory className="text-xl font-bold cursor-pointer" onClick={toggleHistory} />
            </div>
            {isHistoryOpen && (
                <div className={`fixed top-4 bottom-[10vh] h-[88vh] left-4 right-4 bg-[#333333] rounded-lg p-4 ${isHistoryOpen === true ? 'z-30' : '-z-30'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-white">Lịch Sử Chat</h2>
                        <AiOutlineClose className="text-xl text-white cursor-pointer" onClick={closeHistory} />
                    </div>
                    <div className="h-[90%] overflow-y-auto flex flex-col-reverse">
                        {chatHistory.slice().reverse().map((entry, index) => (
                            <div key={index} className={`mb-2 flex flex-col px-6 ${entry.role === "model" ? "text-start" : "text-end"}`}>
                                <div className="font-bold mb-2 text-sm text-[#666666]">{entry.role === "model" ? `${modelName}` : `${username}`}</div>
                                <div className={`p-3 rounded-lg inline-block w-fit mb-4 ${entry.role === "model" ? "bg-[#404040] text-white" : "bg-[#d5f594] ml-auto text-black"} max-w-xs`}>
                                    <div className={`text-sm ${entry.role === "model" ? "" : "text-start"}`}>{entry.parts[0].text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {isTrashOpen && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#333333] rounded-lg p-4 w-[90%] max-w-[600px] ${isTrashOpen === true ? 'z-30' : '-z-30'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-white">Xóa Đoạn Chat</h2>
                        <AiOutlineClose className="text-xl text-white cursor-pointer" onClick={closeTrash} />
                    </div>
                    <p className="text-center text-white mb-4">Hành động này sẽ xóa toàn bộ dữ liệu chat của bạn!</p>
                    <div className="flex justify-center">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleRemoveHistory}>
                            Xóa
                        </button>
                    </div>
                </div>
            )}
            {isTrashRemove && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#333333] rounded-lg p-4 w-[90%] max-w-[600px] ${isTrashRemove === true ? 'z-30' : '-z-30'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-white">Xóa Đoạn Chat</h2>
                        <AiOutlineClose className="text-xl text-white cursor-pointer" onClick={closeTrashRemove} />
                    </div>
                    <p className="text-center text-white mb-4">Dữ liệu đã xóa thành công!</p>
                    <div className="flex justify-center">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={closeTrashRemove}>
                            OK
                        </button>
                    </div>
                </div>
            )}
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
