import React from "react";
import styles from "./style/FileCloud.module.css";
import Button from "../../components/UI/Button/Button";
import PageWrap from "../../components/UI/PageWrap/PageWrap";

const FileList = ({ title, files }) => {
  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`https://skydishch.fun/api/files/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Помилка при скачуванні файлу:", response.status);

      }
    } catch (error) {
      console.error("Помилка мережі при скачуванні файлу:", error);

    }
  };

  return (

    <PageWrap>
      <div className={styles.fileListContainer}>
        <h3>{title}</h3>
        {files.length > 0 ? (
          <ul className={styles.fileList}>
            <br />

            {files.map((file) => {
              const fileSize = file.size;
              let displayedSize;
              let unit;

              if (fileSize >= 1000000000) {
                displayedSize = (fileSize / 1000000000).toFixed(2);
                unit = 'ГБ';
              } else if (fileSize >= 1000000) {
                displayedSize = (fileSize / 1000000).toFixed(2);
                unit = 'МБ';
              } else if (fileSize >= 1000) {
                displayedSize = (fileSize / 1000).toFixed(2);
                unit = 'КБ';
              } else {
                displayedSize = fileSize;
                unit = 'байт';
              }

              return (

                <div className={styles.card}>

                  <div className={styles.card_item_space}>
                    
                    <div className={styles.card_item}>
                      {file.originalName}
                    </div>

                    <div >

                      <div className={styles.card_item}>
                        {displayedSize} {unit}
                      </div>

                      <div className={styles.card_item}>
                        {new Date(file.uploadedAt).toLocaleString()}
                      </div>

                    </div>

                  </div>

                  <div className={styles.card_item_button}>
                    <Button onClick={() => handleDownload(file.filename)}>Скачать  </Button>
                  </div>

                </div>

              );
            })}

          </ul>
        ) : (
          <p>Немає файлів у цій категорії.</p>
        )}
      </div>
    </PageWrap>


  );
};

export default FileList;