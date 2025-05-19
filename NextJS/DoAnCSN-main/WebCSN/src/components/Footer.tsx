'use client';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400'],
    display: 'swap',
});

export default function Footer() {
    return (
        <footer className={`bg-black text-white py-8 mt-8 ${beVietnamPro.className}`}>
            <div className="container mx-auto px-8">
                <div className="text-center text-white">
                    <p>&copy; {new Date().getFullYear()} ShowAI. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}
