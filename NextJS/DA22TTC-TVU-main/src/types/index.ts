export interface DriveInfo {
  total: number;
  used: number;
  remaining: number;
}

export interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size: number;
  isUploading?: boolean;
  uploadProgress?: number;
}

export interface FileListProps {
  files: FileItem[];
  isLoading: boolean;
  currentFolderId: string | null;
  currentFolderName?: string;
  folderPath?: { id: string; name: string }[];
  onFolderClick: (folderId: string) => void;
  onBreadcrumbClick: (folderId: string, index: number) => void;
  onBackClick: () => void;
  onDownload: (fileId: string, fileName: string) => void;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckFolderContent: (folderId: string) => Promise<boolean>;
  onDelete?: (fileId: string) => Promise<void>;
}
