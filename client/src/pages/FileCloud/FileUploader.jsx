import React, { useState, useRef } from 'react';
import styles from './style/FileUploader.module.css';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FileUploader = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/files/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          success('Files uploaded successfully!');
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        } catch (e) {
          error('Error parsing server response');
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          error(errorResponse.message || 'Upload failed');
        } catch (e) {
          error('Upload failed');
        }
      }
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.onerror = () => {
      error('Network error occurred');
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.send(formData);
  };

  return (
    <div className={styles.fileUploaderContainer}>
      <div
        className={`${styles.uploadSection} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h3>Upload Files</h3>
        <div className={styles.uploadArea}>
          <div className={styles.uploadContent}>
            <p>Drag and drop files here or</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
              accept="*/*"
              style={{ display: 'none' }}
              id="fileInput"
            />
            <button
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select Files
            </button>
          </div>
        </div>
        {isUploading && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;