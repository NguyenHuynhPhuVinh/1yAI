import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const {
            studentId,
            password,
            date,
            isWeekView,
            weekOffset,
            week,
            semester,
        } = await req.json();

        if (!studentId || !password || !date) {
            return NextResponse.json(
                { error: "Thiếu thông tin bắt buộc" },
                { status: 400 }
            );
        }

        // 1. Đăng nhập để lấy token
        const loginFormData = new URLSearchParams();
        loginFormData.append("username", studentId);
        loginFormData.append("password", password);
        loginFormData.append("grant_type", "password");

        const loginResponse = await axios.post(
            "https://ttsv.tvu.edu.vn/api/auth/login",
            loginFormData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (!loginResponse.data?.access_token) {
            // Thêm log chi tiết hơn
            console.error("Đăng nhập thất bại:", loginResponse.status, loginResponse.data);
            return NextResponse.json(
                { error: "Đăng nhập thất bại. Vui lòng kiểm tra lại MSSV và mật khẩu." },
                { status: 401 }
            );
        }

        const token = loginResponse.data.access_token;

        // 2. Lấy thời khóa biểu
        const scheduleFormData = new URLSearchParams();
        // Sử dụng học kỳ từ request hoặc mặc định là 20242 nếu không có
        scheduleFormData.append("filter[hoc_ky]", semester || "20242");
        scheduleFormData.append("filter[ten_hoc_ky]", "");
        scheduleFormData.append("additional[paging][limit]", "1000");
        scheduleFormData.append("additional[paging][page]", "1");

        const scheduleResponse = await axios.post(
            "https://ttsv.tvu.edu.vn/api/sch/w-locdstkbtuanusertheohocky",
            scheduleFormData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // 3. Xử lý dữ liệu
        const schedule = scheduleResponse.data;

        // Kiểm tra cấu trúc dữ liệu
        if (!schedule?.data?.ds_tuan_tkb) {
            console.error("Cấu trúc dữ liệu không hợp lệ từ TVU:", schedule);
            return NextResponse.json(
                { error: "Dữ liệu thời khóa biểu không hợp lệ hoặc không có TKB cho học kỳ này." },
                { status: 500 }
            );
        }

        // Hàm xử lý ngày tháng (UTC để so sánh nhất quán)
        const parseDate = (dateStr: string) => {
            // Xử lý định dạng dd/MM/yyyy hoặc yyyy-MM-dd
            const parts = dateStr.split("/");
            if (parts.length === 3) {
                // dd/MM/yyyy -> yyyy-MM-dd
                dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            const date = new Date(dateStr);
            // Lấy ngày UTC để tránh sai lệch múi giờ khi so sánh
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        };

        const formatDateString = (date: Date) => {
            return date.toISOString().split("T")[0]; // Trả về yyyy-MM-dd
        }

        // Nếu có tham số week (số tuần), ưu tiên tìm tuần đó
        if (week && isWeekView) {
            const targetWeek = schedule.data.ds_tuan_tkb.find(
                (w: { thong_tin_tuan?: string }) => {
                    if (!w.thong_tin_tuan) return false;
                    const tuanMatch = w.thong_tin_tuan.match(/Tuần\s+(\d+)/i);
                    return tuanMatch && tuanMatch[1] === week;
                }
            );

            if (!targetWeek) {
                return NextResponse.json({
                    date: date, // Trả về ngày yêu cầu ban đầu
                    subjects: [],
                    weekInfo: {
                        thong_tin_tuan: `Không tìm thấy thông tin cho Tuần ${week} trong học kỳ này`,
                    },
                });
            }

            return NextResponse.json({
                date: date, // Trả về ngày yêu cầu ban đầu
                subjects: targetWeek.ds_thoi_khoa_bieu || [],
                weekInfo: {
                    thong_tin_tuan: targetWeek.thong_tin_tuan,
                    ngay_bat_dau: targetWeek.ngay_bat_dau,
                    ngay_ket_thuc: targetWeek.ngay_ket_thuc,
                },
            });
        }

        // Tìm tuần học dựa trên ngày yêu cầu (date)
        const targetDateUTC = parseDate(date);
        let currentWeekData = null;
        let currentWeekIndex = -1;

        for (let i = 0; i < schedule.data.ds_tuan_tkb.length; i++) {
            const weekData = schedule.data.ds_tuan_tkb[i];
            // Chuyển ngày bắt đầu/kết thúc của tuần sang UTC để so sánh
            const weekStartUTC = parseDate(weekData.ngay_bat_dau);
            const weekEndUTC = parseDate(weekData.ngay_ket_thuc);

            if (targetDateUTC >= weekStartUTC && targetDateUTC <= weekEndUTC) {
                currentWeekData = weekData;
                currentWeekIndex = i;
                break;
            }
        }

        // Nếu không tìm thấy tuần chứa ngày targetDate
        if (!currentWeekData) {
            return NextResponse.json({
                date: date,
                subjects: [],
                weekInfo: {
                    thong_tin_tuan: "Không tìm thấy tuần học cho ngày này.",
                }
            });
        }

        // Nếu là xem theo tuần (isWeekView = true)
        if (isWeekView) {
            // Tính toán index của tuần cần hiển thị dựa trên weekOffset
            const targetWeekIndex = currentWeekIndex + (weekOffset || 0); // Mặc định offset là 0

            if (
                targetWeekIndex < 0 ||
                targetWeekIndex >= schedule.data.ds_tuan_tkb.length
            ) {
                return NextResponse.json({
                    date: date, // Trả về ngày yêu cầu ban đầu
                    subjects: [],
                    weekInfo: {
                        thong_tin_tuan: "Không có dữ liệu cho tuần này",
                    },
                });
            }

            const targetWeekData = schedule.data.ds_tuan_tkb[targetWeekIndex];
            const weekSubjects = targetWeekData.ds_thoi_khoa_bieu || [];

            return NextResponse.json({
                date: date, // Trả về ngày yêu cầu ban đầu
                subjects: weekSubjects,
                weekInfo: {
                    thong_tin_tuan: targetWeekData.thong_tin_tuan,
                    ngay_bat_dau: targetWeekData.ngay_bat_dau,
                    ngay_ket_thuc: targetWeekData.ngay_ket_thuc,
                },
            });
        }

        // Nếu là xem theo ngày (isWeekView = false hoặc không có)
        const subjectsForDay = [];
        const targetDateString = formatDateString(targetDateUTC); // yyyy-MM-dd

        if (currentWeekData.ds_thoi_khoa_bieu) {
            for (const subject of currentWeekData.ds_thoi_khoa_bieu) {
                // Ngày học từ API có thể là dd/MM/yyyy, cần chuẩn hóa sang yyyy-MM-dd
                const subjectDateUTC = parseDate(subject.ngay_hoc);
                const subjectDateString = formatDateString(subjectDateUTC); // yyyy-MM-dd

                if (subjectDateString === targetDateString) {
                    subjectsForDay.push({
                        ten_mon: subject.ten_mon,
                        ten_giang_vien: subject.ten_giang_vien,
                        ma_phong: subject.ma_phong,
                        tiet_bat_dau: subject.tiet_bat_dau,
                        so_tiet: subject.so_tiet,
                        ngay_hoc: subject.ngay_hoc, // Giữ nguyên định dạng gốc để hiển thị
                    });
                }
            }
        }


        return NextResponse.json({
            date: date, // Trả về ngày yêu cầu ban đầu
            subjects: subjectsForDay,
            weekInfo: { // Thêm thông tin tuần hiện tại khi xem theo ngày
                thong_tin_tuan: currentWeekData.thong_tin_tuan,
                ngay_bat_dau: currentWeekData.ngay_bat_dau,
                ngay_ket_thuc: currentWeekData.ngay_ket_thuc,
            }
        });

    } catch (error: unknown) { // Explicitly type error as unknown
        console.error("Lỗi API TVU:", error);

        if (axios.isAxiosError(error)) {
            // Now 'error' is narrowed down to AxiosError
            console.error("Axios error details:", {
                message: error.message, // Safe to access
                code: error.code, // Safe to access
                status: error.response?.status, // Safe to access
                data: error.response?.data, // Safe to access
                config: {
                    url: error.config?.url, // Safe to access
                    method: error.config?.method, // Safe to access
                    headers: error.config?.headers, // Safe to access
                    data: error.config?.data // Cẩn thận log data nếu chứa thông tin nhạy cảm
                }
            });

            // Kiểm tra lỗi đăng nhập cụ thể (Safe to access error.response)
            if (error.response?.status === 401 || (error.response?.config?.url?.includes('auth/login') && error.response?.status !== 200)) {
                // Safely access error_description
                let errorMessage = error.message;
                if (typeof error.response?.data === 'object' && error.response.data !== null && 'error_description' in error.response.data) {
                    errorMessage = (error.response.data as { error_description: string }).error_description;
                }
                return NextResponse.json(
                    {
                        error: "Đăng nhập thất bại. Vui lòng kiểm tra lại MSSV và mật khẩu.",
                        message: errorMessage,
                    },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                {
                    error: "Lỗi kết nối hoặc xử lý từ hệ thống TVU",
                    message: error.message, // Safe to access
                    status: error.response?.status || 500, // Safe to access
                },
                { status: error.response?.status || 500 } // Safe to access
            );
        } else if (error instanceof Error) {
            // Handle generic Error objects
            console.error("Generic Error:", error.message);
            return NextResponse.json({ error: "Lỗi máy chủ nội bộ", message: error.message }, { status: 500 });
        } else {
            // Handle other unknown errors
            console.error("Unknown Error:", error);
            return NextResponse.json({ error: "Lỗi máy chủ nội bộ không xác định" }, { status: 500 });
        }
    }
}
