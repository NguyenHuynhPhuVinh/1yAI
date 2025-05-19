"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { MessageSquare, Notebook } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAISearch: boolean;
  onToggleAISearch: () => void;
  onSearch: () => void;
}

export default function Header({
  searchTerm,
  onSearchChange,
  isAISearch,
  onToggleAISearch,
  onSearch,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div
      className="flex flex-col md:flex-row items-center p-5 gap-4 md:gap-0 
            border-b border-gray-200 dark:border-gray-700 
            bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 
            shadow-sm sticky top-0 z-10"
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 md:mb-0">
        DA22TTC-TVU
      </h1>
      <div className="flex-1 w-full md:mx-8">
        <div className="max-w-[720px] relative">
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={
              isAISearch ? "Tìm kiếm bằng AI..." : "Tìm kiếm tài liệu"
            }
            className="w-full px-12 py-3.5 bg-white dark:bg-gray-700 
                        border border-gray-200 dark:border-gray-600 
                        text-gray-900 dark:text-white
                        rounded-xl outline-none 
                        hover:border-blue-400 focus:border-blue-500 
                        focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 
                        transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAISearch) {
                onSearch();
              }
            }}
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <button
            onClick={onToggleAISearch}
            className={`absolute ${isAISearch ? "right-[4.5rem]" : "right-4"} 
                        top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                        transition-all duration-200 
                        hover:bg-gray-100 dark:hover:bg-gray-600
                        ${
                          isAISearch
                            ? "text-blue-500 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
            title={isAISearch ? "Đang dùng AI" : "Chuyển sang tìm kiếm AI"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </button>

          {isAISearch && (
            <button
              onClick={onSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 
                            bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                            transition-all duration-200 text-sm font-medium"
            >
              Tìm
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-center">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors justify-center"
          title={
            theme === "dark"
              ? "Chuyển sang giao diện sáng"
              : "Chuyển sang giao diện tối"
          }
        >
          {theme === "dark" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <a
            href="https://tomichan.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-blue-500 dark:bg-blue-600 text-white
                    hover:bg-blue-600 dark:hover:bg-blue-700
                    active:scale-95
                    transition-all duration-200 font-medium w-fit"
          >
            <MessageSquare className="w-5 h-5" />
            TomiChan
          </a>

          <button
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl
                    bg-blue-500 dark:bg-blue-600 text-white
                    hover:bg-blue-600 dark:hover:bg-blue-700 
                    active:scale-95
                    transition-all duration-200 font-medium"
            onClick={() => router.push("/txt")}
          >
            <Notebook className="w-5 h-5" />
            Ghi chú
          </button>
        </div>
      </div>
    </div>
  );
}
