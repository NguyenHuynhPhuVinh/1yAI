@echo off
echo Đang kiểm tra môi trường...

:: Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python chưa được cài đặt! Vui lòng cài đặt Python và thử lại.
    pause
    exit
)

:: Kiểm tra và cài đặt các thư viện cần thiết
echo Đang kiểm tra các thư viện...
pip install keyboard pillow google-generativeai tkinter --quiet

:: Chạy chương trình chính
echo.
echo Khởi động chương trình dịch...
echo Phím tắt:
echo - Alt + P: Chọn vùng và dịch ngay
echo - Alt + S: Chọn vùng mặc định
echo - Alt + [1-9]: Chọn và lưu vùng mới
echo - [1-9]: Chọn vùng đã lưu
echo - ~: Dịch vùng hiện tại
echo.

python main.py

pause