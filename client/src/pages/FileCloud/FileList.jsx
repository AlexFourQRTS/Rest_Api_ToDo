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
  const [deleteConfirmFile, setDeleteConfirmFile] = useState(null);
  const { success, error, warning } = useToast();

  const handleDelete = async (fileId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${NestJSAPI}/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      success('File deleted successfully');
      onFilesUpdate();
      setDeleteConfirmFile(null);
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

  const showDeleteConfirmation = (file) => {
    setDeleteConfirmFile(file);
  };

  const cancelDelete = () => {
    setDeleteConfirmFile(null);
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
            onClick={() => showDeleteConfirmation(file)}
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
          <span className={styles.tabIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </span>
          <span className={styles.tabText}>Images</span>
          <span className={styles.tabCount}>({files.images.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'videos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <span className={styles.tabIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </span>
          <span className={styles.tabText}>Videos</span>
          <span className={styles.tabCount}>({files.videos.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'audio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          <span className={styles.tabIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </span>
          <span className={styles.tabText}>Audio</span>
          <span className={styles.tabCount}>({files.audio.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <span className={styles.tabIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
          </span>
          <span className={styles.tabText}>Docs</span>
          <span className={styles.tabCount}>({files.documents.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'other' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('other')}
        >
          <span className={styles.tabIcon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
            </svg>
          </span>
          <span className={styles.tabText}>Other</span>
          <span className={styles.tabCount}>({files.other.length})</span>
        </button>
      </div>
      <div className={styles.fileGroup}>
        {renderFileList(files[activeTab])}
      </div>
      {renderPreview()}

      {deleteConfirmFile && (
        <div className={styles.deleteConfirmOverlay}>
          <div className={styles.deleteConfirmDialog}>
            <h3>Підтвердження видалення</h3>
            <p>Ви впевнені, що хочете видалити файл "{deleteConfirmFile.original_name}"?</p>
            <div className={styles.deleteConfirmActions}>
              <button
                className={styles.cancelButton}
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Скасувати
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={() => handleDelete(deleteConfirmFile.id)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Видалення...' : 'Видалити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FileList };
export default FileList;