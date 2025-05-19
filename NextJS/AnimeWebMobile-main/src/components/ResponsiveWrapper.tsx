// components/ResponsiveWrapper.tsx
"use client"; // Đây là client component

import { useState, useEffect } from "react";

export default function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        handleResize(); // Kiểm tra kích thước màn hình khi component mount
        window.addEventListener("resize", handleResize); // Lắng nghe sự kiện resize

        return () => {
            window.removeEventListener("resize", handleResize); // Hủy bỏ lắng nghe sự kiện khi component unmount
        };
    }, []);

    return (
        <>
            {isLandscape ? (
                <div className="flex bg-black xl:px-24 lg:px-24 px-12 py-6 items-center justify-center text-md sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-white font-bold h-screen w-screen">
                    <div className="bg-red-500 text-center rounded-2xl xl:px-[3em] xl:py-[3em] lg:px-[3em] lg:py-[3em] md:px-[2em] md:py-[2em] sm:px-[1.5em] sm:py-[1.5em]">
                        <p>Màn hình của bạn có chiều rộng lớn hơn chiều cao.</p>
                        <p className="my-5">Nếu bạn sử dụng các thiết bị di động, vui lòng xoay lại màn hình.</p>
                        <p>Nếu bạn sử dụng các thiết bị như LapTop, PC, TV hay các thiết bị có màn hình ngang vui lòng tìm cách chỉnh màn hình sang dạng dọc!</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </>
    );
}
