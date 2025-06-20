import React, { useState, useEffect } from 'react';
import styles from "./style/FileCloud.module.css";
import { authApi } from '../../api/authApi';

import Hero from "../../components/UI/Hero/Hero";

import FileLists from "./FileLists";
import FileUploader from "./FileUploader";
import FileList from './FileList';
import { useToast } from '../../context/ToastContext';

export const FileCloud = () => {
  const [files, setFiles] = useState({
    images: [],
    videos: [],
    audio: [],
    documents: [],
    other: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { error } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch files
        const filesResponse = await fetch('https://skydishch.fun/api/files');
        if (!filesResponse.ok) {
          throw new Error('Failed to fetch files');
        }
        const filesData = await filesResponse.json();
        setFiles(filesData);

        // Fetch user profile
        const userData = await authApi.getProfile();
        setUser(userData);

      } catch (err) {
        error('Error loading data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('https://skydishch.fun/api/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      error('Error loading files: ' + err.message);
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles(); // Обновляем список файлов после успешной загрузки
  };

  return (
    <div className={styles.fileCloudContainer}>
      <Hero title="Upload and Manage Files" />
      <div className={styles.contactCard}>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>
      <FileList files={files} isLoading={isLoading} onFilesUpdate={fetchFiles} user={user} />
    </div>
  );
};

export default FileCloud;