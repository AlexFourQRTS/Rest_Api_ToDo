


import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import { FaFileImage, FaFileVideo, FaFileAudio, 
  FaFileAlt, FaFile, FaPlay, FaDownload, 
  FaTrash, FaCopy, FaLink } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_URL;

export const FileList = ({ files, isLoading, onFilesUpdate, user }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState(null);
  const [copiedFileId, setCopiedFileId] = useState(null);
  const { success, error } = useToast();
  const videoRef = useRef(null);
  const [downloadingFiles, setDownloadingFiles] = useState({});

  const handleDelete = async (fileId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${BASE_URL}/api/files/number${fileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete file');
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
      setDownloadingFiles(prev => ({ ...prev, [fileId]: { progress: 0, status: 'starting' } }));
      const response = await fetch(`${BASE_URL}/api/files/number${fileId}/download`);
      if (!response.ok) throw new Error('Failed to download file');

      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        const progress = total ? Math.round((loaded / total) * 100) : 0;
        setDownloadingFiles(prev => ({ ...prev, [fileId]: { progress, status: 'downloading' } }));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadingFiles(prev => ({ ...prev, [fileId]: { progress: 100, status: 'completed' } }));
      success('File downloaded successfully');
      setTimeout(() => setDownloadingFiles(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      }), 2000);
    } catch (err) {
      setDownloadingFiles(prev => ({ ...prev, [fileId]: { progress: 0, status: 'error' } }));
      error('Error downloading file: ' + err.message);
    }
  };

  const handlePreview = async (file) => {
    try {
      if (file.mime_type.startsWith('video/')) {
        const videoUrl = `${BASE_URL}/api/files/stream/${file.id}`;
        setPreviewFile({ ...file, previewUrl: videoUrl });
      } else {
        const response = await fetch(`${BASE_URL}/api/files/number${file.id}/download`);
        if (!response.ok) throw new Error('Failed to load preview');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewFile({ ...file, previewUrl: url });
      }
    } catch (err) {
      error('Error loading preview: ' + err.message);
    }
  };

  const closePreview = () => {
    if (previewFile?.previewUrl && !previewFile.mime_type.startsWith('video/')) {
      window.URL.revokeObjectURL(previewFile.previewUrl);
    }
    setPreviewFile(null);
  };

  const handleCopyLink = async (fileId) => {
    try {
      const fileUrl = `${BASE_URL}/api/files/number${fileId}/download`;
      await navigator.clipboard.writeText(fileUrl);
      setCopiedFileId(fileId);
      success('Link copied to clipboard');
      setTimeout(() => setCopiedFileId(null), 2000);
    } catch (err) {
      error('Error copying link: ' + err.message);
    }
  };

  const renderPreview = () => {
    if (!previewFile) return null;
    const isImage = previewFile.mime_type.startsWith('image/');
    const isVideo = previewFile.mime_type.startsWith('video/');
    const isAudio = previewFile.mime_type.startsWith('audio/');

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={closePreview}>
        <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 relative" onClick={e => e.stopPropagation()}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold" onClick={closePreview}>×</button>
          {isImage && <img src={previewFile.previewUrl} alt={previewFile.original_name} className="max-h-[70vh] mx-auto" />}
          {isVideo && <video ref={videoRef} controls src={previewFile.previewUrl} className="w-full h-auto" />}
          {isAudio && <audio controls src={previewFile.previewUrl} className="w-full" />}
          <div className="mt-4 text-center text-white">
            <h3 className="font-semibold">{previewFile.original_name}</h3>
            <p className="text-gray-400">{(previewFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
      </div>
    );
  };

  const renderFileItem = (file) => {
    const isVideo = file.type === 'video';
    const isAudio = file.type === 'audio';
    const isImage = file.type === 'image';
    const fileUrl = `${BASE_URL}/api/files/number${file.id}/download`;
    const downloadStatus = downloadingFiles[file.id];

    return (
      <div key={file.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between border border-gray-700">
        <div className="flex items-center space-x-4 flex-1 w-full">
          <div className="text-gray-400 text-2xl">
            {isImage && <FaFileImage />} {isVideo && <FaFileVideo />} {isAudio && <FaFileAudio />}
            {file.type === 'document' && <FaFileAlt />} {file.type === 'other' && <FaFile />}
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-white font-medium block truncate">{file.original_name}</span>
            <span className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <div className="flex items-center space-x-2 text-gray-500 text-xs mt-1">
              <FaLink /> <span className="truncate">{fileUrl}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button className="p-2 text-gray-400 hover:text-white relative" onClick={() => handleCopyLink(file.id)}>
            <FaCopy /> {copiedFileId === file.id && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] py-1 px-2 rounded">Copied!</span>}
          </button>
          <button className="p-2 text-gray-400 hover:text-white" onClick={() => handlePreview(file)}><FaPlay /></button>
          <button className="p-2 text-gray-400 hover:text-white" onClick={() => handleDownload(file.id, file.original_name)} disabled={downloadStatus?.status === 'downloading'}><FaDownload /></button>
          {user?.role === 'admin' && <button className="p-2 text-red-500 hover:text-red-400" onClick={() => setDeleteConfirmFile(file)}><FaTrash /></button>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
        {['images', 'videos', 'audio', 'documents', 'other'].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded-md transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`} onClick={() => setActiveTab(tab)}>
            <span className="capitalize">{tab}</span> <span className="ml-2 opacity-60 text-xs">({files[tab]?.length || 0})</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4">{files[activeTab]?.length > 0 ? files[activeTab].map(renderFileItem) : <div className="text-center text-gray-500 py-10">No files found</div>}</div>
      {renderPreview()}
      {deleteConfirmFile && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-2">Підтвердження</h3>
            <p className="text-gray-400 mb-6">{"Ви впевнені, що хочете видалити файл"} <span className="text-white">"{deleteConfirmFile.original_name}"</span>?</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg" onClick={() => setDeleteConfirmFile(null)}>Скасувати</button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg" onClick={() => handleDelete(deleteConfirmFile.id)} disabled={isDeleting}>{isDeleting ? 'Видалення...' : 'Видалити'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

