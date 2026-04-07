export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface DocumentVersion {
  versionNumber: number;
  filePath: string;
  uploadedAt: string;
}

export interface DocumentItem {
  _id: string;
  filename: string;
  originalName: string;
  filePath: string;
  uploadedBy: User | string;
  tags: string[];
  permissions: {
    view: string[];
    edit: string[];
  };
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}
