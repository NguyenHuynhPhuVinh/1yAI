import { TbWifi } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";

const SetUp2 = ({ onStart, onPrevious }: { onStart: () => void, onPrevious: () => void }) => {
    return (
        <>
            <div className="bg-white h-screen flex flex-col items-center justify-between text-center">
                <div className="flex flex-col items-center justify-center mb-20 w-full px-4">
                    <TbWifi className="text-blue-500 text-4xl ml-3 mt-10" />
                    <h1 className="text-black text-3xl mt-5">Chọn wifi của bạn</h1>
                </div>
                <div className="flex flex-col items-center justify-center mb-20 w-full px-4">
                    <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200 py-3 px-4 mb-4 w-full border border-gray-300">
                        <span className="text-gray-500">Không tìm thấy wifi</span>
                        <TbWifi className="text-gray-400 text-xl" />
                    </div>
                </div>
                <button
                    className="px-12 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-20"
                    onClick={onStart}
                >
                    Tiếp
                </button>
                <div className="absolute bottom-0 left-0 px-3 py-3">
                    <IoIosArrowBack className="text-gray-500 text-2xl cursor-pointer" onClick={onPrevious} />
                </div>
            </div>
        </>
    );
};

export default SetUp2;