import React, { useState, useRef } from 'react';
// Removed CSS module import
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const FileUploader = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const uploadStartTime = useRef(null);
  const lastUploadedSize = useRef(0);
  const { success, error } = useToast();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      handleFileSelect(files);
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setUploadProgress(0);
    setUploadSpeed(0);
    setUploadedSize(0);
    setUploadComplete(false);
    setUploadedFile(null);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadComplete(false);
    uploadStartTime.current = Date.now();
    lastUploadedSize.current = 0;

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/files/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
        setUploadedSize(event.loaded);

        const currentTime = Date.now();
        const timeDiff = (currentTime - uploadStartTime.current) / 1000;
        const bytesUploaded = event.loaded - lastUploadedSize.current;
        const currentSpeed = bytesUploaded / timeDiff;
        setUploadSpeed(currentSpeed);
        lastUploadedSize.current = event.loaded;
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          success('Files uploaded successfully!');
          setUploadComplete(true);
          setUploadedFile(selectedFiles[0]);
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
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.onerror = () => {
      error('Network error occurred');
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    xhr.send(formData);
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-slate-500 bg-slate-500/10' : 'hover:border-slate-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Завантаження файлів</h3>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-300 mb-4">Перетягніть файли сюди або</p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              ref={fileInputRef}
              accept="*/*"
              style={{ display: 'none' }}
              id="fileInput"
            />
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Вибрати файли
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && !isUploading && !uploadComplete && (
          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-white mb-2">Вибрано файл: {selectedFiles[0].name}</p>
            <p className="text-gray-300 mb-4">Розмір: {formatFileSize(selectedFiles[0].size)}</p>
            <button 
              className="btn-primary w-full"
              onClick={handleUpload}
            >
              Завантажити файл
            </button>
          </div>
        )}

        {isUploading && (
          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
              <div
                className="bg-slate-500 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-white mb-2">Прогрес: {uploadProgress.toFixed(1)}%</p>
              <p className="text-gray-300 mb-2">Завантажено: {formatFileSize(uploadedSize)} з {formatFileSize(selectedFiles[0]?.size || 0)}</p>
              <p className="text-gray-300">Швидкість: {formatSpeed(uploadSpeed)}</p>
            </div>
          </div>
        )}

        {uploadComplete && uploadedFile && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-center">
            <div className="text-green-400 text-4xl mb-4">✓</div>
            <h4 className="text-green-400 text-lg font-semibold mb-2">Файл успішно завантажено!</h4>
            <div className="text-center">
              <p className="text-white mb-2">Назва: {uploadedFile.name}</p>
              <p className="text-gray-300 mb-4">Розмір: {formatFileSize(uploadedFile.size)}</p>
            </div>
            <button 
              className="btn-primary w-full"
              onClick={() => {
                setUploadComplete(false);
                setUploadedFile(null);
              }}
            >
              Завантажити інший файл
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;