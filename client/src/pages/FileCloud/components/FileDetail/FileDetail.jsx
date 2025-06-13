import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './FileDetail.module.css';

const FileDetail = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://skydishch.fun/api/files/${fileId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();
        setFile(data);
      } catch (err) {
        console.error('Error fetching file details:', err);
        setError(err.message || 'Помилка при завантаженні файлу');
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`https://skydishch.fun/api/files/${fileId}/download`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Помилка при скачуванні файлу');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.fileCard}>
          <div className={styles.loading}>Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.fileCard}>
          <div className={styles.error}>{error}</div>
          <button className={styles.backButton} onClick={() => navigate('/filecloud')}>
            Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className={styles.container}>
        <div className={styles.fileCard}>
          <div className={styles.error}>Файл не знайдено</div>
          <button className={styles.backButton} onClick={() => navigate('/filecloud')}>
            Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.fileCard}>
        <h1 className={styles.fileName}>{file.originalName}</h1>
        
        <div className={styles.fileInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Розмір:</span>
            <span className={styles.value}>
              {file.size >= 1000000000
                ? `${(file.size / 1000000000).toFixed(2)} ГБ`
                : file.size >= 1000000
                ? `${(file.size / 1000000).toFixed(2)} МБ`
                : file.size >= 1000
                ? `${(file.size / 1000).toFixed(2)} КБ`
                : `${file.size} байт`}
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>Тип:</span>
            <span className={styles.value}>{file.mimetype || 'Невідомий'}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>Завантажено:</span>
            <span className={styles.value}>
              {new Date(file.uploadedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.downloadButton} onClick={handleDownload}>
            Скачати файл
          </button>
          <button className={styles.backButton} onClick={() => navigate('/filecloud')}>
            Повернутися назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetail; 