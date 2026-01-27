import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removed CSS module import
import { DOMEN_BRAHMA_CONST } from 'common/constant';

const DOMEN_Brahma = DOMEN_BRAHMA_CONST ? DOMEN_BRAHMA_CONST : "https://brahmadzen.space"

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
        const response = await fetch(`${DOMEN_Brahma}/api/files/${fileId}`);
        
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
      const response = await fetch(`${DOMEN_Brahma}/api/files/${fileId}/download`);
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
      <div className="p-6">
        <div className="card p-6">
          <div className="text-center text-gray-300">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6">
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/filecloud')}>
            Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="p-6">
        <div className="card p-6">
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">Файл не знайдено</div>
          <button className="btn-primary" onClick={() => navigate('/filecloud')}>
            Повернутися назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="card p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">{file.originalName}</h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-300">Розмір:</span>
              <span className="text-white">
                {file.size >= 1000000000
                  ? `${(file.size / 1000000000).toFixed(2)} ГБ`
                  : file.size >= 1000000
                  ? `${(file.size / 1000000).toFixed(2)} МБ`
                  : file.size >= 1000
                  ? `${(file.size / 1000).toFixed(2)} КБ`
                  : `${file.size} байт`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Тип:</span>
              <span className="text-white">{file.mimetype || 'Невідомий'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Завантажено:</span>
              <span className="text-white">
                {new Date(file.uploadedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn-primary" onClick={handleDownload}>
              Скачати файл
            </button>
            <button className="btn-secondary" onClick={() => navigate('/filecloud')}>
              Повернутися назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetail; 