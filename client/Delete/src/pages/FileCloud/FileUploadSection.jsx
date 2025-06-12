import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import Button from "../../components/UI/Button/Button";
import Label from "../../components/UI/Label/Label";
import styles from './style/FileUploader.module.css';

export const FileUploadSection = ({ title, accept, uploadUrl, formDataName }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const fileInputRef = useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setMessage("");
        setUploadProgress(0);
        setUploadedBytes(0);
        setTotalBytes(0);
      }
      setIsDragging(false);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept,
      multiple: false,
    });

    const handleFileChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
        setMessage("");
        setUploadProgress(0);
        setUploadedBytes(0);
        setTotalBytes(0);
      }
    };

    const handleUpload = async () => {
      if (!selectedFile) {
        setMessage("Будь ласка, виберіть файл для завантаження.");
        return;
      }

      setIsUploading(true);
      // setMessage("Завантаження...");
      setUploadProgress(0);
      setUploadedBytes(0);
      setTotalBytes(selectedFile.size);

      const formData = new FormData();
      formData.append(formDataName, selectedFile);

      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadedBytes(event.loaded);
            setTotalBytes(event.total);
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          setIsUploading(false);
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              setMessage("Файл успішно завантажено!");
              console.log("Успіх:", data);
            } else {
              setMessage(`Помилка завантаження: ${data.message || xhr.statusText}`);
              console.error("Помилка:", data);
            }
          } catch (error) {
            setMessage(`Помилка обробки відповіді: ${error.message}`);
            console.error("Помилка обробки відповіді:", error);
          } finally {
            setSelectedFile(null);
            setUploadProgress(0);
            setUploadedBytes(0);
            setTotalBytes(0);
            if (fileInputRef.current) {
              fileInputRef.current.value = ""; 
            }
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
          setMessage(`Сталася помилка мережі або сервера.`);
          console.error("Помилка мережі або сервера.");
          setSelectedFile(null);
          setUploadProgress(0);
          setUploadedBytes(0);
          setTotalBytes(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        xhr.send(formData);

      } catch (error) {
        setMessage(`Сталася непередбачена помилка: ${error.message}`);
        console.error("Непередбачена помилка:", error);
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadedBytes(0);
        setTotalBytes(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
      }
    };

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className={`${styles.contactCard} ${styles.uploadSection}`}>

        <div className={styles.contactInside}>

          <h2 className={styles.contactTitle}>{title}</h2>
          <div
            {...getRootProps()}
            className={`${styles.uploadControl} ${isDragActive ? styles.dragActive : ''}`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              {...getInputProps()}
              id={`${formDataName}Input`}
              className={styles.uploadInput}
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            <Label htmlFor={`${formDataName}Input`} className={styles.uploadLabel}>
              Перетягніть файл сюди або натисніть, щоб вибрати
            </Label>

          </div>

          {selectedFile && (
            <div className={styles.selectedFile}>
              Обрано файл: <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>({formatBytes(selectedFile.size)})</span>
            </div>
          )}

          {isUploading && (
            <div className={styles.uploadProgress}>
              Прогрес завантаження: {uploadProgress}% ({formatBytes(uploadedBytes)} / {formatBytes(totalBytes)})
              <div className={styles.progressBar}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className={styles.uploadButton}
          >
            {isUploading ? "Завантаження..." : `Завантажити ${title.split(' ').pop().toLowerCase()}`}
          </Button>

          {message && (
            <div className={`${styles.message} ${message.includes("успішно") ? styles.success : styles.error}`}>
              {message}
            </div>
          )}
        </div>

      </div>
    );
  };