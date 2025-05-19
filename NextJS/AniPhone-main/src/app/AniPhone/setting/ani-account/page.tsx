'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';
import { FaUserCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoIosArrowForward } from 'react-icons/io';

const AniAccountPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setIsCreating(true);
        }
    }, []);

    const validateEmail = (email: string): boolean => {
        return email.endsWith('@ani.com');
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleCreateAccount = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        if (!validateEmail(email)) {
            setEmailError('Email phải kết thúc bằng @ani.com');
            isValid = false;
        }
        if (!validatePassword(password)) {
            setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        if (isValid) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);
            setIsCreating(false);
        }
    };

    if (isCreating) {
        return (
            <div className="h-screen bg-black text-white">
                <Nav />
                <div className="p-4 mx-4">
                    <h1 className="text-xl font-[600] mb-6">Tạo Tài khoản Ani</h1>
                    <input
                        type="email"
                        placeholder="Email (@ani.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-1 bg-[#1a1a1a] rounded-xl text-white"
                    />
                    {emailError && <p className="text-red-500 text-sm mb-3">{emailError}</p>}
                    <input
                        type="password"
                        placeholder="Mật khẩu (ít nhất 8 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-1 bg-[#1a1a1a] rounded-xl text-white"
                    />
                    {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 mb-1 bg-[#1a1a1a] rounded-xl text-white"
                    />
                    {confirmPasswordError && <p className="text-red-500 text-sm mb-3">{confirmPasswordError}</p>}
                    <button
                        onClick={handleCreateAccount}
                        className="w-full p-2 bg-blue-500 rounded-xl text-white font-bold mt-4"
                    >
                        Tạo Tài khoản
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white">
            <Nav />
            <div className="p-4 mx-4">
                <div className="flex items-center mb-6">
                    <FaArrowLeftLong
                        className='text-xl cursor-pointer'
                        onClick={() => router.push('/AniPhone/setting')}
                    />
                    <h1 className="text-xl font-[600] mx-4">Tài khoản Ani</h1>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl mb-4">
                    <div className="flex items-center">
                        <FaUserCircle className="text-4xl text-gray-400 mr-4" />
                        <div>
                            <p className="text-lg font-semibold">{email}</p>
                            <p className="text-sm text-gray-400">Tài khoản Ani</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-[#1a1a1a] rounded-xl flex justify-between items-center cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/ani-account/mailbox')}>
                        <span className="text-lg">Hộp thư</span>
                        <IoIosArrowForward className="text-lg" />
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-xl flex justify-between items-center cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/ani-account/profile')}>
                        <span className="text-lg">Thông tin cá nhân</span>
                        <IoIosArrowForward className="text-lg" />
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-xl flex justify-between items-center cursor-pointer"
                        onClick={() => router.push('/AniPhone/setting/ani-account/security')}>
                        <span className="text-lg">Bảo mật</span>
                        <IoIosArrowForward className="text-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AniAccountPage;
