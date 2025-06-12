import React from "react";
import styles from "./style/FileCloud.module.css";

import Hero from "../../components/UI/Hero/Hero";

import FileLists from "./FileLists";
import FileUploader from "./FileUploader";

export const FileCloud = () => {
  return (
    <div className={styles.contact}>
      <Hero title="Upload and Manage Files" />
      <div className={styles.contactCard}>
        <FileUploader />
      </div>
      <div>
        <FileLists />
      </div>
    </div>
  );
};