"use client"; // Add this directive for client components

import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper"; // Adjusted import path
import { getLocalStorage, setLocalStorage } from "../utils/localStorage"; // Adjusted import path

interface TVUScheduleToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onEnable, onDisable, isEnabled might be used by parent, keep props but remove internal usage
    onEnable: () => void; // Prop kept for potential parent usage
    onDisable: () => void; // Prop kept for potential parent usage
    isEnabled: boolean; // Prop kept for potential parent usage
}

export default function TVUScheduleToolModal({
    isOpen,
    onClose,
    // onEnable, // Removed from destructuring as not used internally
    // onDisable, // Removed from destructuring as not used internally
    // isEnabled, // Removed from destructuring as not used internally
}: TVUScheduleToolModalProps) {
    // Hàm lấy học kỳ mặc định dựa vào thời gian hiện tại
    const getDefaultSemester = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // getMonth() trả về 0-11

        // Học kỳ 1: từ tháng 9 đến tháng 1 năm sau
        // Học kỳ 2: từ tháng 2 đến tháng 6
        // Học kỳ hè (3): tháng 7, 8 (Giả định, cần kiểm tra lại logic của TVU)
        if (currentMonth >= 9 || currentMonth === 1) {
            // Học kỳ 1 của năm học mới (nếu tháng 1 thì là của năm trước)
            const year = currentMonth === 1 ? currentYear - 1 : currentYear;
            return `${year}1`;
        } else if (currentMonth >= 2 && currentMonth <= 6) {
            // Học kỳ 2 của năm học hiện tại (năm bắt đầu từ năm trước)
            return `${currentYear - 1}2`;
        } else {
            // Học kỳ hè (tháng 7, 8) - Giả định là học kỳ 3 của năm học trước
            return `${currentYear - 1}3`; // Cần xác nhận mã học kỳ hè của TVU
        }
    };

    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [semester, setSemester] = useState(getDefaultSemester());
    const [semesters, setSemesters] = useState<
        { value: string; label: string }[]
    >([]); // Khởi tạo rỗng, sẽ được tạo sau

    // Hàm tạo danh sách học kỳ dựa vào MSSV
    const generateSemesters = (mssv: string) => {
        // Lấy số năm từ MSSV (vị trí 5-6, ví dụ: 110122203 -> 22)
        const yearMatch = mssv.match(/^1101(\d{2})/);
        if (!yearMatch || mssv.length < 7) { // Thêm kiểm tra độ dài MSSV
            setSemesters([{ value: getDefaultSemester(), label: `Học kỳ hiện tại (${getDefaultSemester()})` }]); // Chỉ hiển thị học kỳ mặc định nếu MSSV không hợp lệ
            return;
        }


        const startYear = 2000 + parseInt(yearMatch[1]);
        const currentYear = new Date().getFullYear();
        // Giới hạn tối đa 6 năm học (từ năm bắt đầu) hoặc đến năm hiện tại + 1
        const maxYear = Math.min(startYear + 5, currentYear + 1);

        const semesterList = [];

        // Tạo danh sách học kỳ từ năm bắt đầu đến năm kết thúc
        for (let year = startYear; year <= maxYear; year++) {
            // Thêm học kỳ 3 (Hè) - Cần xác nhận mã học kỳ hè
            semesterList.unshift({
                value: `${year}3`,
                label: `Học kỳ Hè năm ${year}-${year + 1}`,
            });
            // Thêm học kỳ 2
            semesterList.unshift({
                value: `${year}2`,
                label: `Học kỳ 2 năm ${year}-${year + 1}`,
            });
            // Thêm học kỳ 1
            semesterList.unshift({
                value: `${year}1`,
                label: `Học kỳ 1 năm ${year}-${year + 1}`,
            });
        }

        setSemesters(semesterList);

        // Chọn học kỳ mặc định nếu nó có trong danh sách, nếu không chọn cái mới nhất
        const defaultSemester = getDefaultSemester();
        const hasDefault = semesterList.some(sem => sem.value === defaultSemester);
        if (hasDefault) {
            setSemester(defaultSemester);
        } else if (semesterList.length > 0) {
            setSemester(semesterList[0].value); // Chọn học kỳ mới nhất
        }
    };

    // Load cấu hình từ localStorage khi mở modal
    useEffect(() => {
        const savedStudentId = getLocalStorage("tool:tvu_schedule:student_id", "");
        const savedPassword = getLocalStorage("tool:tvu_schedule:password", "");
        const savedSemester = getLocalStorage(
            "tool:tvu_schedule:semester",
            getDefaultSemester() // Lấy học kỳ mặc định mới nhất
        );
        setStudentId(savedStudentId);
        setPassword(savedPassword);


        // Tạo danh sách học kỳ nếu có MSSV đã lưu
        if (savedStudentId) {
            generateSemesters(savedStudentId);
            // Đảm bảo semester đã lưu được chọn nếu nó tồn tại trong list mới tạo
            setSemester(savedSemester);
        } else {
            // Nếu không có MSSV, tạo danh sách mặc định chỉ có học kỳ hiện tại
            const defaultSem = getDefaultSemester();
            setSemesters([{ value: defaultSem, label: `Học kỳ hiện tại (${defaultSem})` }]);
            setSemester(defaultSem);
        }
    }, [isOpen]); // Chạy lại khi modal mở ra

    // Lưu và tạo lại danh sách học kỳ khi MSSV thay đổi
    useEffect(() => {
        if (studentId.trim()) {
            setLocalStorage("tool:tvu_schedule:student_id", studentId);
            generateSemesters(studentId);
        } else {
            // Nếu xóa hết MSSV, quay lại học kỳ mặc định
            const defaultSem = getDefaultSemester();
            setSemesters([{ value: defaultSem, label: `Học kỳ hiện tại (${defaultSem})` }]);
            setSemester(defaultSem);
        }
    }, [studentId]);

    // Lưu mật khẩu khi thay đổi
    useEffect(() => {
        // Chỉ lưu nếu có giá trị, không lưu chuỗi rỗng vào password
        if (password) {
            setLocalStorage("tool:tvu_schedule:password", password);
        } else {
            // Cân nhắc có nên xóa key password khỏi localStorage khi input rỗng không
            // removeLocalStorage("tool:tvu_schedule:password");
        }
    }, [password]);

    // Lưu học kỳ khi thay đổi
    useEffect(() => {
        if (semester.trim()) {
            setLocalStorage("tool:tvu_schedule:semester", semester);
        }
    }, [semester]);

    // Removed handleSubmit and handleDisable as buttons are removed

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Cấu hình Xem TKB TVU"
            maxWidth="md" // Giảm xuống md để không quá to trên màn hình lớn
        >
            {/* Use white background, remove internal header */}
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-[var(--card-bg)]">
                {/* Header section */}
                <div className="mb-1 md:mb-2">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--text-primary)] mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2">
                        <span className="p-1 sm:p-1.5 rounded-full bg-[var(--primary-gradient)] text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </span>
                        Cài đặt công cụ lịch học TVU
                    </h2>
                </div>

                {/* Phần cấu hình */}
                <form className="space-y-4 md:space-y-6">

                    <div className="relative">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 md:mb-2">
                            Mã số sinh viên
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="Ví dụ: 110122001"
                                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary-light)] transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 md:mb-2">
                            Mật khẩu TTSV
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu đăng nhập TTSV"
                                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary-light)] transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 md:mb-2">
                            Học kỳ
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-2 md:pr-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary-light)] transition-all duration-300 appearance-none"
                            >
                                {semesters.length > 0 ? (
                                    semesters.map((sem) => (
                                        <option key={sem.value} value={sem.value}>
                                            {sem.label}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Nhập MSSV để xem danh sách học kỳ</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Thông báo tự động lưu */}
                    <div className="text-center text-[var(--text-tertiary)] text-xs md:text-sm italic">
                        Thông tin sẽ được tự động lưu khi thay đổi
                    </div>

                    {/* Nút đóng */}
                    <div className="flex justify-center md:justify-end items-center pt-3 md:pt-5"> 
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-2.5 text-sm font-medium bg-[var(--primary-gradient)] text-white rounded-lg hover:shadow-[var(--shadow-md)] transition-all duration-300 shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </ModalWrapper>
    );
}
