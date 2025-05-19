import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import { DriveInfo, FileItem } from "../../types";

const useDrive = () => {
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [driveInfo, setDriveInfo] = useState<DriveInfo | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [currentFolderName, setCurrentFolderName] = useState<string>("");
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isAISearch, setIsAISearch] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    const fetchDriveInfo = async () => {
      setIsLoading(true);
      try {
        const driveResponse = await fetch("/api/drive/info");
        const driveData = await driveResponse.json();
        setDriveInfo(driveData);

        const filesResponse = await fetch("/api/drive");
        const filesData = await filesResponse.json();
        const sortedFiles = sortFilesByType(filesData.files || []);
        setFiles(sortedFiles);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thư mục:", error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriveInfo();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const sortFilesByType = (files: FileItem[]) => {
    return [...files].sort((a, b) => {
      const isAFolder = a.mimeType === "application/vnd.google-apps.folder";
      const isBFolder = b.mimeType === "application/vnd.google-apps.folder";

      if (isAFolder && !isBFolder) return -1;
      if (!isAFolder && isBFolder) return 1;
      return 0;
    });
  };

  const handleFolderClick = async (folderId: string, folderName?: string) => {
    if (currentFolderId) {
      setFolderHistory([...folderHistory, currentFolderId]);
      setFolderPath([
        ...folderPath,
        { id: currentFolderId, name: currentFolderName },
      ]);
    } else {
      setFolderHistory([]);
      setFolderPath([]);
    }

    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName || "");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await response.json();
      setFiles(sortFilesByType(data.files));
      setShowFiles(true);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = async () => {
    if (folderHistory.length > 0) {
      const newHistory = [...folderHistory];
      const previousFolderId = newHistory.pop();

      const newPath = [...folderPath];
      const previousFolder = newPath.pop();

      setFolderHistory(newHistory);
      setFolderPath(newPath);
      setCurrentFolderId(previousFolderId || null);
      setCurrentFolderName(previousFolder?.name || "");

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/drive${previousFolderId ? `?folderId=${previousFolderId}` : ""}`
        );
        const data = await response.json();
        setFiles(sortFilesByType(data.files));
      } catch (error) {
        console.error("Lỗi khi quay lại thư mục:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const response = await fetch("/api/drive");
        const data = await response.json();
        setFiles(sortFilesByType(data.files));
        setCurrentFolderId(null);
        setCurrentFolderName("");
        setFolderPath([]);
        setFolderHistory([]);
      } catch (error) {
        console.error("Lỗi khi quay về thư mục gốc:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateFolder = () => {
    setIsCreateFolderModalOpen(true);
  };

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const response = await fetch("/api/drive/create-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          name: newFolderName,
          parentId: currentFolderId,
        }),
      });
      const data = await response.json();

      if (data.error) {
        alert("Lỗi khi tạo thư mục");
      } else {
        // Đóng modal và reset form
        setIsCreateFolderModalOpen(false);
        setNewFolderName("");

        // Cập nhật folderHistory và folderPath trước khi vào thư mục mới
        if (currentFolderId) {
          setFolderHistory([...folderHistory, currentFolderId]);
          setFolderPath([
            ...folderPath,
            { id: currentFolderId, name: currentFolderName },
          ]);
        }

        // Tự động vào thư mục mới tạo
        if (data.id) {
          setCurrentFolderId(data.id);
          setCurrentFolderName(newFolderName);

          // Lấy nội dung thư mục mới
          const folderResponse = await fetch(`/api/drive?folderId=${data.id}`);
          const folderData = await folderResponse.json();
          setFiles(sortFilesByType(folderData.files));
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo thư mục:", error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const uploadPromises: Promise<void>[] = [];
    const tempFiles: FileItem[] = [];

    Array.from(files).forEach((file) => {
      const tempFile: FileItem = {
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        createdTime: new Date().toISOString(),
        isUploading: true,
        uploadProgress: 0,
      };

      tempFiles.push(tempFile);

      const uploadPromise = new Promise<void>((resolve, reject) => {
        const upload = async () => {
          try {
            // Lấy signed URL
            const urlResponse = await fetch("/api/drive/get-upload-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: file.name,
                mimeType: file.type,
                parentId: currentFolderId,
              }),
            });

            const { uploadUrl } = await urlResponse.json();

            // Upload file
            await new Promise<void>((uploadResolve, uploadReject) => {
              const xhr = new XMLHttpRequest();
              xhr.open("PUT", uploadUrl, true);
              xhr.setRequestHeader("Content-Type", file.type);

              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const progress = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === tempFile.id
                        ? { ...f, uploadProgress: progress }
                        : f
                    )
                  );
                }
              };

              xhr.onload = () => {
                if (xhr.status === 200) {
                  uploadResolve();
                } else {
                  uploadReject(
                    new Error(`Upload failed with status ${xhr.status}`)
                  );
                }
              };

              xhr.onerror = () => uploadReject(new Error("Upload failed"));
              xhr.send(file);
            });

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        upload();
      });

      uploadPromises.push(uploadPromise);
    });

    // Thêm các file tạm vào danh sách
    setFiles((prev) => sortFilesByType([...prev, ...tempFiles]));

    try {
      // Đợi tất cả file upload xong
      await Promise.all(uploadPromises);

      // Xóa tất cả file tạm và refresh danh sách một lần
      setTimeout(async () => {
        setFiles((prev) =>
          prev.filter((f) => !tempFiles.some((temp) => temp.id === f.id))
        );

        const refreshResponse = await fetch(
          currentFolderId
            ? `/api/drive?folderId=${currentFolderId}`
            : "/api/drive",
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            cache: "no-store",
          }
        );
        const refreshData = await refreshResponse.json();
        setFiles(sortFilesByType(refreshData.files));
      }, 2500); // Đợi 1 giây sau khi tất cả upload xong
    } catch (error) {
      console.error("Lỗi khi upload files:", error);
      // Xóa các file tạm trong trường hợp lỗi
      setFiles((prev) =>
        prev.filter((f) => !tempFiles.some((temp) => temp.id === f.id))
      );
    }

    event.target.value = "";
  };

  const handleUploadFolder = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const rootFolderName = files[0].webkitRelativePath.split("/")[0];

    // Tạo thư mục tạm để hiển thị
    const tempFolder: FileItem = {
      id: `temp-folder-${Date.now()}`,
      name: rootFolderName,
      mimeType: "application/vnd.google-apps.folder",
      size: Array.from(files).reduce((total, file) => total + file.size, 0),
      createdTime: new Date().toISOString(),
      isUploading: true,
      uploadProgress: 0,
    };

    setFiles((prev) => sortFilesByType([tempFolder, ...prev]));

    try {
      const totalSize = Array.from(files).reduce(
        (total, file) => total + file.size,
        0
      );
      let uploadedSize = 0;

      // Map để lưu trữ ID của các thư mục đã tạo
      const folderMap = new Map<string, string>();

      // Tạo thư mục gốc
      const rootFolderResponse = await fetch("/api/drive/create-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rootFolderName,
          parentId: currentFolderId,
        }),
      });
      const { id: rootFolderId } = await rootFolderResponse.json();
      folderMap.set(rootFolderName, rootFolderId);

      // Xử lý từng file
      for (const file of Array.from(files)) {
        const pathParts = file.webkitRelativePath.split("/");
        let currentParentId = rootFolderId;

        // Tạo cấu trúc thư mục nếu cần
        for (let i = 1; i < pathParts.length - 1; i++) {
          const folderPath = pathParts.slice(0, i + 1).join("/");

          if (!folderMap.has(folderPath)) {
            const folderResponse = await fetch("/api/drive/create-folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: pathParts[i],
                parentId: currentParentId,
              }),
            });
            const { id: folderId } = await folderResponse.json();
            folderMap.set(folderPath, folderId);
            currentParentId = folderId;
          } else {
            currentParentId = folderMap.get(folderPath)!;
          }
        }

        // Upload file vào thư mục tương ứng
        const formData = new FormData();
        const fileName = file.name.split("/").pop() || file.name; // Lấy phần cuối của đường dẫn
        const fileBlob = new Blob([file], { type: file.type });
        const cleanFile = new File([fileBlob], fileName, { type: file.type });
        formData.append("file", cleanFile);
        formData.append("parentId", currentParentId);

        await fetch("/api/drive/upload", {
          method: "POST",
          body: formData,
        });

        uploadedSize += file.size;
        const progress = Math.round((uploadedSize / totalSize) * 100);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === tempFolder.id ? { ...f, uploadProgress: progress } : f
          )
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2500));

      const refreshResponse = await fetch(
        currentFolderId
          ? `/api/drive?folderId=${currentFolderId}`
          : "/api/drive",
        { headers: { "Cache-Control": "no-cache" } }
      );
      const refreshData = await refreshResponse.json();
      setFiles(sortFilesByType(refreshData.files));
    } catch (error) {
      console.error("Lỗi:", error);
      setFiles((prev) => prev.filter((f) => f.id !== tempFolder.id));
      alert("Có lỗi xảy ra khi tải lên thư mục");
    }

    event.target.value = "";
  };

  const checkFolderContent = async (folderId: string) => {
    try {
      const response = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await response.json();
      return data.files.some(
        (file: FileItem) =>
          file.mimeType === "application/vnd.google-apps.folder"
      );
    } catch (error) {
      console.error("Lỗi khi kiểm tra nội dung thư mục:", error);
      return false;
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/drive/download?fileId=${fileId}`);
      const data = await response.json();

      if (data.downloadUrl) {
        // Tạo một thẻ a và kích hoạt nó để tải xuống
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      alert("Không thể tải file");
    }
  };

  const handleSearch = async (term: string) => {
    // Kiểm tra nếu chuỗi chỉ chứa khoảng trắng
    if (!term.trim()) {
      // Nếu đang ở chế độ AI và xóa hết nội dung, lấy lại danh sách gốc
      if (isAISearch) {
        const response = await fetch("/api/drive");
        const data = await response.json();
        setFiles(sortFilesByType(data.files));
      }
      return;
    }

    setIsLoading(true);
    try {
      if (isAISearch) {
        // Reset về thư mục gốc khi tìm kiếm
        setCurrentFolderId(null);
        setCurrentFolderName("");
        setFolderPath([]);
        setFolderHistory([]);
        // Tìm kiếm bằng AI
        const keyResponse = await fetch("/api/drive/ai-search");
        const { apiKey } = await keyResponse.json();

        const allFilesResponse = await fetch("/api/drive/all");
        const allFilesData = await allFilesResponse.json();

        const simpleFiles = allFilesData.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
        }));

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        };

        const chatSession = model.startChat({
          generationConfig,
          history: [],
        });

        const prompt = `
            Bạn là AI assistant giúp tìm kiếm file và thư mục. Với yêu cầu tìm kiếm: "${term}"
            Hãy phân tích danh sách và trả về mảng chứa ID của các file/thư mục phù hợp.
            
            Lưu ý:
            - Thư mục có mimeType là "application/vnd.google-apps.folder"
            - Tìm kiếm dựa trên tên và loại (file/thư mục)
            - Chỉ trả về mảng JSON chứa các ID, không kèm giải thích

            Ví dụ danh sách files đầu vào:
            [
              {
                "id": "1abc123",
                "name": "Tài liệu học tập",
                "mimeType": "application/vnd.google-apps.folder"
              },
              {
                "id": "2xyz456",
                "name": "báo cáo.docx",
                "mimeType": "application/vnd.google-docs"
              }
            ]

            Ví dụ response cần trả về khi tìm "tài liệu":
            ["1abc123"]

            Danh sách files cần tìm:
            ${JSON.stringify(simpleFiles, null, 2)}
          `;

        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();

        try {
          const fileIds = JSON.parse(text);
          const filteredFiles = allFilesData.files.filter((file: any) =>
            fileIds.includes(file.id)
          );
          setFiles(sortFilesByType(filteredFiles));
        } catch (error) {
          console.error("Lỗi parse JSON:", error);
          setFiles([]);
        }
      } else {
        // Reset về thư mục gốc khi tìm kiếm
        setCurrentFolderId(null);
        setCurrentFolderName("");
        setFolderPath([]);
        setFolderHistory([]);
        // Tìm kiếm thông thường
        const response = await fetch(
          `/api/drive?q=${encodeURIComponent(term)}`
        );
        const data = await response.json();
        setFiles(sortFilesByType(data.files));
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Nếu chuỗi rỗng hoặc chỉ chứa khoảng trắng
    if (!value.trim()) {
      // Reset về danh sách ban đầu
      const resetSearch = async () => {
        try {
          const response = await fetch("/api/drive");
          const data = await response.json();
          setFiles(sortFilesByType(data.files));
          // Reset các state liên quan
          setCurrentFolderId(null);
          setCurrentFolderName("");
          setFolderPath([]);
          setFolderHistory([]);
        } catch (error) {
          console.error("Lỗi khi reset tìm kiếm:", error);
        }
      };
      resetSearch();
      return;
    }

    // Chỉ tự động tìm kiếm khi không phải AI search
    if (!isAISearch) {
      const timeout = setTimeout(() => {
        handleSearch(value);
      }, 500);
      setSearchTimeout(timeout);
    }
  };

  const handleSearchClick = () => {
    handleSearch(searchTerm);
  };

  const handleBreadcrumbClick = async (folderId: string, index: number) => {
    // Cắt folderPath và folderHistory tới vị trí được click
    const newPath = folderPath.slice(0, index);
    const newHistory = folderHistory.slice(0, index);

    setFolderPath(newPath);
    setFolderHistory(newHistory);
    setCurrentFolderId(folderId);

    // Lấy tên thư mục từ folderPath
    const folder = folderPath[index];
    setCurrentFolderName(folder?.name || "");

    setIsLoading(true);
    try {
      const response = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await response.json();
      setFiles(sortFilesByType(data.files));
    } catch (error) {
      console.error("Lỗi khi điều hướng qua breadcrumb:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAISearch = () => {
    setIsAISearch(!isAISearch);
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/drive/delete?fileId=${fileId}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi khi xóa file");
      }

      // Cập nhật lại danh sách files sau khi xóa
      if (currentFolderId) {
        const refreshResponse = await fetch(
          `/api/drive?folderId=${currentFolderId}`,
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
        const refreshData = await refreshResponse.json();
        setFiles(sortFilesByType(refreshData.files));
      } else {
        const refreshResponse = await fetch("/api/drive", {
          headers: { "Cache-Control": "no-cache" },
        });
        const refreshData = await refreshResponse.json();
        setFiles(sortFilesByType(refreshData.files));
      }
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
      toast.error("Có lỗi xảy ra khi xóa file");
    }
  };

  return {
    files,
    setFiles,
    isLoading,
    setIsLoading,
    driveInfo,
    setDriveInfo,
    currentFolderId,
    setCurrentFolderId,
    folderHistory,
    setFolderHistory,
    searchTerm,
    setSearchTerm,
    searchTimeout,
    setSearchTimeout,
    currentFolderName,
    setCurrentFolderName,
    folderPath,
    setFolderPath,
    isAISearch,
    setIsAISearch,
    formatBytes,
    handleFolderClick,
    handleBackClick,
    handleSearch,
    handleSearchChange,
    handleSearchClick,
    handleBreadcrumbClick,
    handleToggleAISearch,
    handleDelete,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleUploadFile,
    handleUploadFolder,
    checkFolderContent,
    handleDownload,
    isCreatingFolder,
    setIsCreatingFolder,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    newFolderName,
    setNewFolderName,
  };
};

export default useDrive;
