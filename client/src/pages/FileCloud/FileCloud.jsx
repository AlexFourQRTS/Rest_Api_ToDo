import React, { useState, useEffect } from 'react';
import styles from "./style/FileCloud.module.css";

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
  const { error } = useToast();

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = () => {
    fetchFiles(); // Обновляем список файлов после успешной загрузки
  };

  return (
    <div className={styles.fileCloudContainer}>
      <Hero title="Upload and Manage Files" />
      <div className={styles.contactCard}>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>
      <FileList files={files} isLoading={isLoading} onFilesUpdate={fetchFiles} />
    </div>
  );
};

export default FileCloud;