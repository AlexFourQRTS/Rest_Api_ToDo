import React, { useState } from "react";
import styles from './style/FileUploader.module.css';

import { FileUploadSection } from "./FileUploadSection";
import PageWrap from "../../components/UI/PageWrap/PageWrap";

const FileUploader = () => {
  const [selectedType, setSelectedType] = useState("other");

  const handleTabClick = (type) => {
    setSelectedType(type);
  };

  return (
    <PageWrap>
          <div className={styles.fileUploaderContainer}>
      <div className={styles.selectorContainer}>
        <button
          className={`${styles.selectorButton} ${selectedType === "photo" ? styles.active : ""}`}
          onClick={() => handleTabClick("photo")}
        >
          Фото
        </button>
        <button
          className={`${styles.selectorButton} ${selectedType === "video" ? styles.active : ""}`}
          onClick={() => handleTabClick("video")}
        >
          Відео
        </button>
        <button
          className={`${styles.selectorButton} ${selectedType === "audio" ? styles.active : ""}`}
          onClick={() => handleTabClick("audio")}
        >
          Аудіо
        </button>
        <button
          className={`${styles.selectorButton} ${selectedType === "other" ? styles.active : ""}`}
          onClick={() => handleTabClick("other")}
        >
          Інші файли
        </button>
      </div>

      <div className={styles.uploadSection}>
        {selectedType === "photo" && (
          <FileUploadSection
            title="Завантажити фото"
            accept="image/*"
            uploadUrl="https://skydishch.fun/api/photo/upload"
            formDataName="photo"
          />
        )}
        {selectedType === "video" && (
          <FileUploadSection
            title="Завантажити відео"
            accept="video/*"
            uploadUrl="https://skydishch.fun/api/video/upload"
            formDataName="video"
          />
        )}
        {selectedType === "audio" && (
          <FileUploadSection
            title="Завантажити аудіо"
            accept="audio/*"
            uploadUrl="https://skydishch.fun/api/audio/upload"
            formDataName="audio"
          />
        )}
        {selectedType === "other" && (
          <FileUploadSection
            title="Завантажити інші файли"
            uploadUrl="https://skydishch.fun/api/files/upload"
            formDataName="otherFile"
          />
        )}
      </div>
      <div id="generalMessage" className={styles.message}></div>
    </div>
    </PageWrap>

  );
};

export default FileUploader;