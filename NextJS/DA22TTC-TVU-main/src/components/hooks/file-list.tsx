import React, { useState, useRef, useEffect, useMemo } from "react";
import { FileItem, FileListProps } from "../../types";
import JSZip from "jszip";
import { toast } from "react-hot-toast";

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1 ? "" : fileName.substring(lastDotIndex + 1);
}

// Thêm enum cho các tiêu chí sắp xếp
enum SortCriteria {
  Default = "default",
  Name = "name",
  Size = "size",
  Date = "date",
}

export const useFileList = ({
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
}: FileListProps) => {
  // Tách thư mục và file
  const folders = useMemo(() => {
    return files.filter(
      (file) => file.mimeType === "application/vnd.google-apps.folder"
    );
  }, [files]);

  const regularFiles = useMemo(() => {
    return files.filter(
      (file) => file.mimeType !== "application/vnd.google-apps.folder"
    );
  }, [files]);

  // Thêm state cho tiêu chí sắp xếp
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>(
    SortCriteria.Default
  );

  // Thêm state cho bộ lọc đuôi file
  const [selectedExtension, setSelectedExtension] = useState<string | null>(
    null
  );

  // Lấy danh sách đuôi file duy nhất
  const uniqueExtensions = useMemo(() => {
    const extensions = regularFiles
      .map((file) => getFileExtension(file.name).toLowerCase())
      .filter((ext) => ext !== "");
    return Array.from(new Set(extensions)).sort();
  }, [regularFiles]);

  // Thêm state để theo dõi việc hiển thị thư mục
  const [showFolders, setShowFolders] = useState(true);

  // Hàm sắp xếp files dựa trên tiêu chí
  const getSortedFiles = (files: FileItem[]) => {
    let folders = files.filter(
      (file) => file.mimeType === "application/vnd.google-apps.folder"
    );
    let regularFiles = files.filter(
      (file) => file.mimeType !== "application/vnd.google-apps.folder"
    );

    // Lọc theo đuôi file nếu có
    if (selectedExtension) {
      regularFiles = regularFiles.filter(
        (file) =>
          getFileExtension(file.name).toLowerCase() === selectedExtension
      );
    }

    switch (sortCriteria) {
      case SortCriteria.Name:
        folders.sort((a, b) => a.name.localeCompare(b.name));
        regularFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortCriteria.Size:
        folders.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        );
        regularFiles.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case SortCriteria.Date:
        folders.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        );
        regularFiles.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        );
        break;
      default:
        folders.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        );
        regularFiles.sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        );
    }

    // Trả về danh sách files dựa vào trạng thái hiển thị thư mục
    return showFolders ? [...folders, ...regularFiles] : regularFiles;
  };

  // Thay thế dòng const sortedFiles = [...folders, ...regularFiles]; bằng:
  const sortedFiles = useMemo(
    () => getSortedFiles(files),
    [files, showFolders, sortCriteria, selectedExtension]
  );

  // State để lưu trữ chế độ hiển thị
  const [isGridView, setIsGridView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  // Thêm state để theo dõi tiến trình nén
  const [compressingFolder, setCompressingFolder] = useState<string | null>(
    null
  );
  const [compressionProgress, setCompressionProgress] = useState(0);

  const [hasFolders, setHasFolders] = useState<{ [key: string]: boolean }>({});

  // Thêm state để quản lý menu đang mở
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Thêm state cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Thêm state kiểm tra admin mode
  const [isAdminMode] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has("admin");
    }
    return false;
  });

  useEffect(() => {
    const checkFolders = async () => {
      const results: { [key: string]: boolean } = {};
      for (const file of files) {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          results[file.id] = await onCheckFolderContent(file.id);
        }
      }
      setHasFolders(results);
    };
    checkFolders();
  }, [files, onCheckFolderContent]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) return;

    const entries = Array.from(items)
      .map((item) => item.webkitGetAsEntry())
      .filter((entry): entry is FileSystemEntry => entry !== null);

    const files: File[] = [];
    let hasFolder = false;
    let rootFolderName = "";

    for (const entry of entries) {
      if (entry.isDirectory) {
        hasFolder = true;
        rootFolderName = entry.name;
        const directoryReader = (
          entry as FileSystemDirectoryEntry
        ).createReader();

        const readEntries = (): Promise<FileSystemEntry[]> => {
          return new Promise((resolve, reject) => {
            directoryReader.readEntries(resolve, reject);
          });
        };

        const processEntry = async (
          entry: FileSystemEntry,
          path: string = ""
        ) => {
          if (entry.isFile) {
            const fileEntry = entry as FileSystemFileEntry;
            return new Promise<void>((resolve, reject) => {
              fileEntry.file((file: File) => {
                const relativePath = path ? `${path}/${file.name}` : file.name;
                const newFile = new File([file], file.name, {
                  type: file.type,
                });
                Object.defineProperty(newFile, "webkitRelativePath", {
                  value: relativePath,
                });
                files.push(newFile);
                resolve();
              }, reject);
            });
          } else if (entry.isDirectory) {
            const dirEntry = entry as FileSystemDirectoryEntry;
            const reader = dirEntry.createReader();

            // Đọc tất cả entries trong thư mục hiện tại
            const readAllEntries = async (): Promise<FileSystemEntry[]> => {
              const entries: FileSystemEntry[] = [];

              const readNextBatch = async (): Promise<void> => {
                const batch = await new Promise<FileSystemEntry[]>(
                  (resolve, reject) => {
                    reader.readEntries(resolve, reject);
                  }
                );

                if (batch.length > 0) {
                  entries.push(...batch);
                  await readNextBatch();
                }
              };

              await readNextBatch();
              return entries;
            };

            // Đọc tất cả entries
            const entries = await readAllEntries();
            const newPath = path ? `${path}/${entry.name}` : entry.name;

            // Xử lý đệ quy cho mỗi entry
            for (const childEntry of entries) {
              await processEntry(childEntry, newPath);
            }
          }
        };

        await processEntry(entry);
      }
    }

    if (hasFolder && files.length > 0) {
      const filesArray = Object.assign(files, {
        item: (i: number) => files[i],
        rootFolderName,
      });

      const event = {
        target: {
          files: filesArray,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onUploadFolder(event);
    } else {
      const event = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onUploadFile(event);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Thêm hàm để tạo link tải file
  const generateDownloadLink = (fileId: string) => {
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
  };

  // Hàm tải về thư mục dưới dạng zip
  const handleDownloadFolder = async (folderId: string, folderName: string) => {
    try {
      setCompressingFolder(folderId);
      setCompressionProgress(0);

      // Lấy danh sách files
      const response = await fetch(
        `/api/drive/download-folder?folderId=${folderId}`
      );
      const data = await response.json();

      if (!data.files || !data.files.length) {
        throw new Error("No files found");
      }

      const zip = new JSZip();
      let downloadedFiles = 0;

      // Tải từng file qua API proxy
      for (const file of data.files) {
        if (file.mimeType !== "application/vnd.google-apps.folder") {
          try {
            const fileResponse = await fetch(
              `/api/drive/download-folder?fileId=${file.id}`
            );
            if (!fileResponse.ok) continue;

            const blob = await fileResponse.blob();
            zip.file(file.name, blob);

            downloadedFiles++;
            const progress = Math.round(
              (downloadedFiles / data.files.length) * 100
            );
            setCompressionProgress(progress);
          } catch (error) {
            console.error(`Lỗi khi tải file ${file.name}:`, error);
            continue;
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi tải thư mục:", error);
      alert("Có lỗi xảy ra khi tải thư mục");
    } finally {
      setCompressingFolder(null);
      setCompressionProgress(0);
    }
  };
  // Thêm hàm xử lý đóng menu
  const handleMouseLeave = () => {
    setOpenMenuId(null);
  };

  // Thêm hàm xử lý xóa
  const handleDelete = async (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation();
    setFileToDelete(file);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  // Thêm hàm xác nhận xóa
  const confirmDelete = async () => {
    if (!fileToDelete || !onDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch("/api/drive/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        throw new Error("Mật khẩu không đúng");
      }

      await onDelete(fileToDelete.id);
      toast.success("Đã xóa thành công!");
      setShowDeleteModal(false);
      setDeletePassword("");
      setFileToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    files: sortedFiles,
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
    setOpenMenuId,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragOver,
    generateDownloadLink,
    handleDownloadFolder,
    handleMouseLeave,
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
  };
};
