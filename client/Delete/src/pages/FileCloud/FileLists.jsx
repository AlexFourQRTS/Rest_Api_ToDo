import React, { useState, useEffect, useRef } from "react";
import FileList from "./FileList";
import PageWrap from "../../components/UI/PageWrap/PageWrap";
import styles from "./style/FileList.module.css"; 


const FileLists = () => {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://skydishch.fun/api/files");
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          console.error("Помилка при отриманні списку файлів:", response.status);
        }
      } catch (error) {
        console.error("Помилка мережі при отриманні списку файлів:", error);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = () => {
    if (selectedCategory === "all") {
      return files;
    }
    return files.filter((file) => {
      switch (selectedCategory) {
        case "image":
          return file.mimeType.startsWith("image/");
        case "video":
          return file.mimeType.startsWith("video/");
        case "audio":
          return file.mimeType.startsWith("audio/");
        case "document":
          return file.mimeType.includes("application/") || file.mimeType.includes("text/");
        default:
          return !file.mimeType.startsWith("image/") &&
                 !file.mimeType.startsWith("video/") &&
                 !file.mimeType.startsWith("audio/") &&
                 !(file.mimeType.includes("application/") || file.mimeType.includes("text/"));
      }
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "all":
        return "Всі файли";
      case "image":
        return "Зображення";
      case "video":
        return "Відео";
      case "audio":
        return "Аудіо";
      case "document":
        return "Документи";
      default:
        return "Інші файли";
    }
  };

  const countFilesByCategory = (category) => {
    if (category === "all") {
      return files.length;
    }
    return files.filter((file) => {
      if (category === "image") {
        return file.mimeType.startsWith("image/");
      } else if (category === "video") {
        return file.mimeType.startsWith("video/");
      } else if (category === "audio") {
        return file.mimeType.startsWith("audio/");
      } else if (category === "document") {
        return file.mimeType.includes("application/") || file.mimeType.includes("text/");
      } else {
        return !file.mimeType.startsWith("image/") &&
               !file.mimeType.startsWith("video/") &&
               !file.mimeType.startsWith("audio/") &&
               !(file.mimeType.includes("application/") || file.mimeType.includes("text/"));
      }
    }).length;
  };

  return (
    <PageWrap>
      <div>
        <h2>Список файлів</h2>

        <ul className={styles.categoryTabs}>
          <li
            className={selectedCategory === "all" ? styles.active : ""}
            onClick={() => handleCategoryClick("all")}
          >
            Всі файли ({countFilesByCategory("all")})
          </li>
          <li
            className={selectedCategory === "image" ? styles.active : ""}
            onClick={() => handleCategoryClick("image")}
          >
            Зображення ({countFilesByCategory("image")})
          </li>
          <li
            className={selectedCategory === "video" ? styles.active : ""}
            onClick={() => handleCategoryClick("video")}
          >
            Відео ({countFilesByCategory("video")})
          </li>
          <li
            className={selectedCategory === "audio" ? styles.active : ""}
            onClick={() => handleCategoryClick("audio")}
          >
            Аудіо ({countFilesByCategory("audio")})
          </li>
          <li
            className={selectedCategory === "document" ? styles.active : ""}
            onClick={() => handleCategoryClick("document")}
          >
            Документи ({countFilesByCategory("document")})
          </li>
          <li
            className={selectedCategory !== "all" &&
                       selectedCategory !== "image" &&
                       selectedCategory !== "video" &&
                       selectedCategory !== "audio" &&
                       selectedCategory !== "document"
                       ? styles.active
                       : ""}
            onClick={() => handleCategoryClick("other")}
          >
            Інші ({countFilesByCategory("other")})
          </li>
        </ul>

        <FileList title={getCategoryTitle()} files={filteredFiles()} />
      </div>
    </PageWrap>
  );
};

export default FileLists;