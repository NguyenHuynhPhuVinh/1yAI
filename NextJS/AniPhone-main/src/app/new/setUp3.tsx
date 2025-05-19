
const SetUp3 = ({ onStart }: { onStart: () => void }) => {

    return (
        <>
            <div className="bg-white h-screen flex flex-col items-center justify-between text-center">
                <h1 className="text-black text-3xl mt-20">Bạn đã thiết đặt xong</h1>
                <button className="px-12 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-20"
                    onClick={onStart}>
                    Hoàn Thành
                </button>
            </div>
        </>
    );
};

export default SetUp3;