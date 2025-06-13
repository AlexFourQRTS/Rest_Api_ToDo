import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './style/FileLists.module.css';
import { FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt, FaFile, FaPlay, FaDownload, FaTrash } from 'react-icons/fa'; // Removed unused icons

// Access the API URL from environment variables
const NestJSAPI = process.env.REACT_APP_API_URL;

const FileList = ({ files, isLoading, onFilesUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [previewFile, setPreviewFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Consider if these media states are still needed with the new preview approach
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false); // Consider if these media states are still needed with the new preview approach
  const { success, error, warning } = useToast();

  const handleDelete = async (fileId) => {
    try {
      warning('Are you sure you want to delete this file?', 0);
      setIsDeleting(true);
      const response = await fetch(`${NestJSAPI}/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      success('File deleted successfully');
      onFilesUpdate(); // Обновляем список файлов после удаления
    } catch (err) {
      error('Error deleting file: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`${NestJSAPI}/api/files/${fileId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success('File downloaded successfully');
    } catch (err) {
      error('Error downloading file: ' + err.message);
    }
  };

  const handlePreview = async (file) => {
    try {
      const response = await fetch(`${NestJSAPI}/api/files/${file.id}/download`);
      if (!response.ok) {
        throw new Error('Failed to load preview');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewFile({ ...file, previewUrl: url });
    } catch (err) {
      error('Error loading preview: ' + err.message);
    }
  };

  const closePreview = () => {
    if (previewFile?.previewUrl) {
      window.URL.revokeObjectURL(previewFile.previewUrl);
    }
    setPreviewFile(null);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const renderPreview = () => {
    if (!previewFile) return null;

    const isImage = previewFile.mime_type.startsWith('image/');
    const isVideo = previewFile.mime_type.startsWith('video/');
    const isAudio = previewFile.mime_type.startsWith('audio/');

    return (
      <div className={styles.previewOverlay} onClick={closePreview}>
        <div className={styles.previewContent} onClick={e => e.stopPropagation()}>
          <button className={styles.closePreview} onClick={closePreview}>×</button>
          {isImage && (
            <img src={previewFile.previewUrl} alt={previewFile.original_name} />
          )}
          {isVideo && (
            <video controls src={previewFile.previewUrl}>
              Your browser does not support the video tag.
            </video>
          )}
          {isAudio && (
            <audio controls src={previewFile.previewUrl}>
              Your browser does not support the audio tag.
            </audio>
          )}
          <div className={styles.previewInfo}>
            <h3>{previewFile.original_name}</h3>
            <p>{(previewFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
      </div>
    );
  };

  const renderFileItem = (file) => {
    const isVideo = file.type === 'video';
    const isAudio = file.type === 'audio';
    const isImage = file.type === 'image';

    return (
      <div key={file.id} className={styles.fileItem}>
        <div className={styles.fileInfo}>
          <div className={styles.fileIcon}>
            {isImage && <FaFileImage />}
            {isVideo && <FaFileVideo />}
            {isAudio && <FaFileAudio />}
            {file.type === 'document' && <FaFileAlt />}
            {file.type === 'other' && <FaFile />}
          </div>
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>{file.original_name}</span>
            <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>

        <div className={styles.fileActions}>
          {/* The media files in the main list view are now using `handlePreview` for playback */}
          <button
            className={styles.actionButton}
            onClick={() => handlePreview(file)}
            title="Preview"
          >
            <FaPlay />
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleDownload(file.id, file.original_name)}
            title="Download"
          >
            <FaDownload />
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleDelete(file.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  const renderFileList = (files) => {
    if (!files || files.length === 0) {
      return <div className={styles.noFiles}>No files found</div>;
    }

    return (
      <div className={styles.fileList}>
        {files.map((file) => renderFileItem(file))}
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading files...</div>;
  }

  return (
    <div className={styles.fileListsContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'images' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Images ({files.images.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'videos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos ({files.videos.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio ({files.audio.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({files.documents.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'other' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('other')}
        >
          Other ({files.other.length})
        </button>
      </div>
      <div className={styles.fileGroup}>
        {renderFileList(files[activeTab])}
      </div>
      {renderPreview()}
    </div>
  );
};

export { FileList };
export default FileList;