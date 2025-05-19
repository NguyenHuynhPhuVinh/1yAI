"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "next-themes";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { useFileList } from "./hooks/file-list";
import { FileListProps } from "../types";

export default function FileList({
  files,
  isLoading,
  currentFolderId,
  currentFolderName,
  folderPath = [],
  onFolderClick,
  onBreadcrumbClick,
  onBackClick,
  onDownload,
  onUploadFile,
  onUploadFolder,
  onCheckFolderContent,
  onDelete,
}: FileListProps) {
  const { theme } = useTheme();

  const {
    files: sortedFiles,
    uniqueExtensions,
    showFolders,
    setSortCriteria,
    setSelectedExtension,
    setShowFolders,
    isGridView,
    setIsGridView,
    isDragging,
    compressingFolder,
    compressionProgress,
    hasFolders,
    openMenuId,
    showDeleteModal,
    deletePassword,
    fileToDelete,
    isDeleting,
    isAdminMode,
    handleMouseLeave,
    setOpenMenuId,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    generateDownloadLink,
    handleDownloadFolder,
    handleDelete,
    confirmDelete,
    selectedExtension,
    sortCriteria,
    SortCriteria,
    formatFileSize,
    setDeletePassword,
    setShowDeleteModal,
    setFileToDelete,
    setIsDeleting,
  } = useFileList({
    files,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick,
    onBreadcrumbClick,
    onBackClick,
    onDownload,
    onUploadFile,
    onUploadFolder,
    onCheckFolderContent,
    onDelete,
  });

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-0"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div
          className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm border-2 border-dashed 
                    border-blue-500 rounded-xl flex items-center justify-center transition-all duration-300"
        >
          <div className="text-center bg-white p-6 rounded-xl shadow-lg">
            <svg
              className="mx-auto h-12 w-12 text-blue-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-blue-600">
              Thả file hoặc thư mục để tải lên
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="p-2 md:p-4 md:pb-2">
        {currentFolderId && (
          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm mb-2 overflow-x-auto whitespace-nowrap">
            <span
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                            cursor-pointer font-medium flex-shrink-0"
              onClick={() => onBackClick()}
            >
              DA22TTC
            </span>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                                    cursor-pointer font-medium truncate max-w-[80px] md:max-w-[200px]"
                  onClick={() => onBreadcrumbClick(folder.id, index)}
                >
                  {folder.name}
                </span>
              </React.Fragment>
            ))}
            {currentFolderName && (
              <>
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-gray-800 dark:text-gray-100 font-medium truncate max-w-[100px] md:max-w-[200px]">
                  {currentFolderName}
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          {currentFolderId && (
            <button
              onClick={onBackClick}
              className="inline-flex items-center px-2 md:px-4 py-2 
                                text-gray-700 dark:text-gray-200 
                                bg-white dark:bg-gray-800 
                                hover:bg-gray-50 dark:hover:bg-gray-700
                                rounded-xl border border-gray-200 dark:border-gray-700 
                                shadow-sm transition-all duration-200"
            >
              <svg
                className="w-5 h-5 md:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden md:inline font-medium">Quay lại</span>
            </button>
          )}

          {!isLoading && (
            <div
              className={`flex flex-wrap items-center gap-2 ${
                currentFolderId ? "" : "ml-auto"
              }`}
            >
              {/* Nút ẩn/hiện thư mục */}
              <button
                onClick={() => setShowFolders(!showFolders)}
                className="inline-flex items-center px-3 md:px-4 py-2 
                                    text-gray-700 dark:text-gray-200 
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    rounded-xl border border-gray-200 dark:border-gray-700 
                                    shadow-sm transition-all duration-200"
                title={showFolders ? "Ẩn thư mục" : "Hiện thư mục"}
              >
                <svg
                  className="w-5 h-5 md:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    color: showFolders ? "currentColor" : "#9CA3AF",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span className="hidden md:inline">
                  {showFolders ? "Ẩn thư mục" : "Hiện thư mục"}
                </span>
              </button>

              {/* Dropdown bộ lọc đuôi file */}
              <Menu as="div" className="relative">
                <Menu.Button
                  className="inline-flex items-center px-3 md:px-4 py-2 
                                    text-gray-700 dark:text-gray-200 
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    rounded-xl border border-gray-200 dark:border-gray-700 
                                    shadow-sm transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 md:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="hidden md:inline">
                    {selectedExtension ? `.${selectedExtension}` : "Loại file"}
                  </span>
                  <svg
                    className="w-5 h-5 hidden md:inline md:ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute right-0 mt-2 w-56 origin-top-right 
                                        bg-white dark:bg-gray-800 
                                        rounded-xl border border-gray-200 dark:border-gray-700
                                        shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                                        divide-y divide-gray-100 dark:divide-gray-700"
                  >
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setSelectedExtension(null)}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } ${
                              selectedExtension === null
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
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
                            Tất cả
                          </button>
                        )}
                      </Menu.Item>
                      {uniqueExtensions.map((ext) => (
                        <Menu.Item key={ext}>
                          {({ active }) => (
                            <button
                              onClick={() => setSelectedExtension(ext)}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-700" : ""
                              } ${
                                selectedExtension === ext
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-200"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              .{ext}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Dropdown bộ lọc sắp xếp */}
              <Menu as="div" className="relative">
                <Menu.Button
                  className="inline-flex items-center px-3 md:px-4 py-2 
                                    text-gray-700 dark:text-gray-200 
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    rounded-xl border border-gray-200 dark:border-gray-700 
                                    shadow-sm transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 md:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="hidden md:inline">Sắp xếp</span>
                  <svg
                    className="w-5 h-5 hidden md:inline md:ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute right-0 mt-2 w-56 origin-top-right 
                                        bg-white dark:bg-gray-800 
                                        rounded-xl border border-gray-200 dark:border-gray-700
                                        shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                                        divide-y divide-gray-100 dark:divide-gray-700"
                  >
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              setSortCriteria(SortCriteria.Default)
                            }
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } ${
                              sortCriteria === SortCriteria.Default
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
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
                            Mặc định
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setSortCriteria(SortCriteria.Name)}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } ${
                              sortCriteria === SortCriteria.Name
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                              />
                            </svg>
                            Tên
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setSortCriteria(SortCriteria.Size)}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } ${
                              sortCriteria === SortCriteria.Size
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                              />
                            </svg>
                            Dung lượng
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setSortCriteria(SortCriteria.Date)}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } ${
                              sortCriteria === SortCriteria.Date
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Ngày tạo
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Nút chuyển đổi grid/list view */}
              <button
                onClick={() => setIsGridView(!isGridView)}
                className="inline-flex items-center px-3 md:px-4 py-2 
                                    text-gray-700 dark:text-gray-200 
                                    bg-white dark:bg-gray-800 
                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                    rounded-xl border border-gray-200 dark:border-gray-700 
                                    shadow-sm transition-all duration-200"
              >
                {isGridView ? (
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
                      d="M4 6h16M4 12h16M4 18h16"
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
                      d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Grid/List với khả năng cuộn */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-8">
        <div
          className={`
                    grid gap-2 py-2
                    ${
                      isGridView
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }
                `}
        >
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse"
              >
                <div className="flex items-center">
                  <Skeleton
                    circle
                    width={24}
                    height={24}
                    className="mr-3"
                    baseColor={theme === "dark" ? "#374151" : "#f3f4f6"}
                    highlightColor={theme === "dark" ? "#4B5563" : "#e5e7eb"}
                  />
                  <Skeleton
                    width={200}
                    height={20}
                    baseColor={theme === "dark" ? "#374151" : "#f3f4f6"}
                    highlightColor={theme === "dark" ? "#4B5563" : "#e5e7eb"}
                  />
                </div>
              </div>
            ))
          ) : sortedFiles.length === 0 ? (
            <div
              className="col-span-full flex flex-col items-center justify-center py-16 
                            bg-white dark:bg-gray-800 rounded-xl"
            >
              <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Thư mục trống
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Chưa có tệp tin hoặc thư mục nào
              </p>
            </div>
          ) : (
            sortedFiles.map((file) => (
              <div
                key={file.id}
                className={`
                                    bg-white dark:bg-gray-800 rounded-xl 
                                    border border-gray-100 dark:border-gray-700 
                                    shadow-sm hover:shadow-md
                                    transition-all duration-200 cursor-pointer group
                                    ${
                                      file.isUploading
                                        ? "opacity-80 pointer-events-none"
                                        : ""
                                    }
                                `}
                onClick={() =>
                  file.mimeType === "application/vnd.google-apps.folder"
                    ? onFolderClick(file.id)
                    : null
                }
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-4">
                  <div className="flex items-center">
                    {/* File/Folder Icon */}
                    {file.mimeType === "application/vnd.google-apps.folder" ? (
                      <svg
                        className="w-10 h-10 text-blue-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 1.99 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-10 h-10 text-gray-400 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                    )}

                    {/* File/Folder Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-4">
                        <span>
                          {new Date(file.createdTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {file.size && <span>{formatFileSize(file.size)}</span>}
                      </div>
                    </div>

                    {/* Download Button */}
                    {!file.isUploading && (
                      <Menu as="div" className="relative">
                        <Menu.Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === file.id ? null : file.id
                            );
                          }}
                          className="p-2 text-gray-500 dark:text-gray-400 
                                                        hover:text-gray-700 dark:hover:text-gray-200 
                                                        hover:bg-gray-100 dark:hover:bg-gray-700
                                                        rounded-lg transition-colors
                                                        opacity-0 group-hover:opacity-100"
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
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </Menu.Button>

                        {openMenuId === file.id && (
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              className="absolute right-0 mt-2 w-48 origin-top-right 
                                                            bg-white dark:bg-gray-800 
                                                            rounded-xl border border-gray-200 dark:border-gray-700
                                                            shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                                                            divide-y divide-gray-100 dark:divide-gray-700"
                            >
                              <div className="px-1 py-1">
                                {/* Nút copy link */}
                                {file.mimeType !==
                                  "application/vnd.google-apps.folder" && (
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const link = generateDownloadLink(
                                            file.id
                                          );
                                          navigator.clipboard.writeText(link);
                                          toast.success(
                                            "Đã sao chép link tải file!",
                                            {
                                              duration: 2000,
                                              style: {
                                                background:
                                                  theme === "dark"
                                                    ? "#374151"
                                                    : "#fff",
                                                color:
                                                  theme === "dark"
                                                    ? "#fff"
                                                    : "#000",
                                                border:
                                                  theme === "dark"
                                                    ? "1px solid #4B5563"
                                                    : "1px solid #E5E7EB",
                                              },
                                            }
                                          );
                                        }}
                                        className={`${
                                          active
                                            ? "bg-gray-100 dark:bg-gray-700"
                                            : ""
                                        } 
                                                                                    group flex w-full items-center px-4 py-2 text-sm
                                                                                    text-gray-700 dark:text-gray-200 rounded-lg`}
                                      >
                                        <svg
                                          className="w-5 h-5 mr-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                          />
                                        </svg>
                                        Sao chép link
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}

                                {/* Nút tải xuống */}
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        file.mimeType ===
                                        "application/vnd.google-apps.folder"
                                          ? handleDownloadFolder(
                                              file.id,
                                              file.name
                                            )
                                          : onDownload(file.id, file.name);
                                      }}
                                      className={`${
                                        active
                                          ? "bg-gray-100 dark:bg-gray-700"
                                          : ""
                                      } 
                                                                                group flex w-full items-center px-4 py-2 text-sm
                                                                                text-gray-700 dark:text-gray-200 rounded-lg`}
                                    >
                                      <svg
                                        className="w-5 h-5 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                      </svg>
                                      Tải xuống
                                    </button>
                                  )}
                                </Menu.Item>

                                {/* Thêm dấu gạch ngang phân cách nếu có nút xóa */}
                                {isAdminMode && (
                                  <>
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={(e) => handleDelete(e, file)}
                                          className={`${
                                            active
                                              ? "bg-red-50 dark:bg-red-900"
                                              : ""
                                          } 
                                                                                        group flex w-full items-center px-4 py-2 text-sm
                                                                                        text-red-600 dark:text-red-400 rounded-lg`}
                                        >
                                          <svg
                                            className="w-5 h-5 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                          Xóa vĩnh viễn
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </>
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        )}
                      </Menu>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {(file.isUploading || compressingFolder === file.id) && (
                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              file.isUploading
                                ? file.uploadProgress
                                : compressionProgress
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 text-right mt-1">
                        {file.isUploading
                          ? file.uploadProgress
                          : compressionProgress}
                        %
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Thêm modal xác nhận xóa vào cuối component, trước thẻ đóng div cuối cùng */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Xác nhận xóa vĩnh viễn
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bạn có chắc chắn muốn xóa &quot;{fileToDelete?.name}&quot;? Hành
                động này không thể hoàn tác.
              </p>
              <input
                type="password"
                placeholder="Nhập mật khẩu admin"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                                    dark:text-white mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setFileToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 
                                        hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting || !deletePassword}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                                        ${
                                          isDeleting
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                        }
                                    `}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
