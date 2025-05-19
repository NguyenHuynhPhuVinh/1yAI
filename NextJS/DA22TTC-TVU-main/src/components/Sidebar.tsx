"use client";
import React from "react";
import { DriveInfo } from "../types";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface SidebarProps {
  driveInfo: DriveInfo | null;
  onCreateFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatBytes: (bytes: number) => string;
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export default function Sidebar({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}: SidebarProps) {
  const folderInputRef = React.useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isInteractionOpen, setIsInteractionOpen] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkTheme(isDark);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkTheme(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCreateFolder = () => {
    onClose();
    onCreateFolder();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
                fixed md:sticky top-0 md:top-[84px] w-72 
                bg-gradient-to-b from-gray-50 to-white 
                dark:from-gray-800 dark:to-gray-900
                p-4 ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 transition-transform duration-300 ease-out
                z-50 flex flex-col shadow-lg md:shadow-none
                h-[100vh] md:h-[calc(100vh-84px)]
                overflow-y-auto
            `}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                        text-gray-600 dark:text-gray-400
                        hover:text-gray-900 dark:hover:text-gray-100
                        rounded-xl transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleCreateFolder}
              className="flex items-center space-x-3 px-6 py-3.5 rounded-xl 
                            bg-blue-50 dark:bg-blue-900/30 
                            text-blue-600 dark:text-blue-400 
                            hover:bg-blue-100 dark:hover:bg-blue-900/50
                            font-medium transition-all duration-200 mb-4 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Tạo Thư Mục</span>
            </button>

            <div className="space-y-3">
              <label
                htmlFor="fileInput"
                className="flex items-center space-x-3 px-6 py-3.5 rounded-xl 
                                bg-gray-50 dark:bg-gray-800 
                                text-gray-700 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                font-medium transition-all duration-200 cursor-pointer group"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Tải File Lên</span>
              </label>

              <label
                htmlFor="folderInput"
                className="flex items-center space-x-3 px-6 py-3.5 rounded-xl 
                                bg-gray-50 dark:bg-gray-800 
                                text-gray-700 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                font-medium transition-all duration-200 cursor-pointer group"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span>Tải Thư Mục Lên</span>
              </label>
            </div>

            {/* Hidden inputs */}
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={(e) => {
                onUploadFile(e);
                onClose();
              }}
              className="hidden"
              ref={fileInputRef}
            />
            <input
              id="folderInput"
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              onChange={(e) => {
                onUploadFolder(e);
                onClose();
              }}
              className="hidden"
              ref={folderInputRef}
            />

            <div className="mt-6">
              <div
                className="flex items-center space-x-3 px-6 py-3.5 rounded-xl 
                            hover:bg-gray-100 dark:hover:bg-gray-700
                            transition-colors text-gray-700 dark:text-gray-200 font-medium"
              >
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>DA22TTC</span>
              </div>
            </div>
          </>
        )}

        {driveInfo && !isLoading ? (
          <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Bộ nhớ đã dùng
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 
                                rounded-full transition-all duration-300"
                style={{
                  width: `${(driveInfo.used / driveInfo.total) * 100}%`,
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {formatBytes(driveInfo.remaining)} còn trống
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-auto p-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 animate-pulse" />
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
