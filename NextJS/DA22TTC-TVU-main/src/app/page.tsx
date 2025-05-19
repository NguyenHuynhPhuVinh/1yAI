"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FileList from "../components/FileList";
import { Dialog } from "@headlessui/react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import useDrive from "../components/hooks/drive";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    files,
    isLoading,
    driveInfo,
    currentFolderId,
    currentFolderName,
    folderPath,
    searchTerm,
    isAISearch,
    setSearchTerm,
    handleSearchChange,
    handleSearchClick,
    handleFolderClick,
    handleBreadcrumbClick,
    handleBackClick,
    handleToggleAISearch,
    handleDelete,
    formatBytes,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleUploadFile,
    handleUploadFolder,
    checkFolderContent,
    handleDownload,
    isCreatingFolder,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    newFolderName,
    setNewFolderName,
  } = useDrive();
  const { theme } = useTheme();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10000, // Đặt z-index cao hơn modal của Broadcast (9999)
        }}
        toastOptions={{
          style: {
            background: theme === "dark" ? "#374151" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            border:
              theme === "dark" ? "1px solid #4B5563" : "1px solid #E5E7EB",
          },
        }}
      />

      <div className="max-w-[1800px] w-full mx-auto flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <Header
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          isAISearch={isAISearch}
          onToggleAISearch={handleToggleAISearch}
          onSearch={handleSearchClick}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            driveInfo={driveInfo}
            onCreateFolder={handleCreateFolder}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            formatBytes={formatBytes}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            fileInputRef={React.useRef<HTMLInputElement>(null)}
            isLoading={isLoading}
          />

          <FileList
            files={files}
            isLoading={isLoading}
            currentFolderId={currentFolderId}
            currentFolderName={currentFolderName}
            folderPath={folderPath}
            onFolderClick={(id) => {
              const folder = files.find((f) => f.id === id);
              handleFolderClick(id, folder?.name);
            }}
            onBreadcrumbClick={handleBreadcrumbClick}
            onBackClick={handleBackClick}
            onDownload={handleDownload}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            onCheckFolderContent={checkFolderContent}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Dialog
        open={isCreateFolderModalOpen}
        onClose={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-[30vw] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Tạo thư mục mới
            </Dialog.Title>

            <form onSubmit={handleCreateFolderSubmit}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nhập tên thư mục"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 my-4"
                disabled={isCreatingFolder}
              />

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    !isCreatingFolder && setIsCreateFolderModalOpen(false)
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                  bg-gray-100 dark:bg-gray-700 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-600"
                  disabled={isCreatingFolder}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white 
                  bg-blue-500 rounded-md hover:bg-blue-600 
                  disabled:opacity-50"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                >
                  {isCreatingFolder ? "Đang tạo..." : "Tạo thư mục"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
