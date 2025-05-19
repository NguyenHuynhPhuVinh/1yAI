import { useState } from 'react';
import { MdExpandMore } from "react-icons/md";

const SetUp1 = ({ onStart }: { onStart: () => void }) => {
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Tiếng Việt');
    const [language, setLanguage] = useState('Tiếng Việt');

    const handleLanguageSelect = (language: string) => {
        setLanguage(language);
        setShowLanguageModal(false);
    };

    return (
        <>
            <div className="bg-white h-screen flex flex-col items-center justify-between text-center">
                <h1 className="text-black text-3xl mt-20">Xin Chào!</h1>
                <div className="flex flex-col items-center justify-center mb-20">
                    <div
                        className="flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200 py-2 px-2 mb-4"
                        onClick={() => setShowLanguageModal(true)}
                    >
                        <p className="text-black text-md ml-1">{language}</p>
                        <MdExpandMore className="text-black text-xl ml-3" />
                    </div>
                    <button className="px-12 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={onStart}>
                        Bắt Đầu
                    </button>
                </div>
            </div>
            {showLanguageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-xl mb-4">Chọn ngôn ngữ</h2>
                        <ul>
                            <li className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2" onClick={() => setSelectedLanguage('Tiếng Việt')}>
                                <span>Tiếng Việt</span>
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    {selectedLanguage === 'Tiếng Việt' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                                </div>
                            </li>
                            <li className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2" onClick={() => setSelectedLanguage('Tiếng Ani')}>
                                <span>Tiếng Ani</span>
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    {selectedLanguage === 'Tiếng Ani' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                                </div>
                            </li>
                        </ul>
                        <div className="mt-4 flex justify-between">
                            <button className="px-4 py-2 bg-gray-300 text-black rounded" onClick={() => setShowLanguageModal(false)}>Thoát</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => {
                                handleLanguageSelect(selectedLanguage);
                                setShowLanguageModal(false);
                            }}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SetUp1;