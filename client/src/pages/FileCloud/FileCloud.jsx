import React, { useState, useEffect } from 'react';
import styles from "./style/FileCloud.module.css";
import { authApi } from '../../api/authApi';
import Hero from "../../components/UI/Hero/Hero";
import FileLists from "./FileLists";
import FileUploader from "./FileUploader";
import FileList from './FileList';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      error('Error loading files: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchFiles()
      
      const userData = await authApi.getProfile();
      setUser(userData);

      setIsLoading(false);
    };

    fetchInitialData();
  }, []);


  const handleUploadSuccess = () => {
    fetchFiles();
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