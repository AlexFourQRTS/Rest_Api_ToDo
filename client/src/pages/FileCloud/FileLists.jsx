import React from 'react';
import { FileList } from './FileList';
import styles from './style/FileLists.module.css';

const FileLists = () => {
  return (
    <div className={styles.fileListsContainer}>
      <FileList />
    </div>
  );
};

export default FileLists;