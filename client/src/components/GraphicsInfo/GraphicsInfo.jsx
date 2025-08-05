import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Palette, Layers, Settings } from 'lucide-react';
import styles from './GraphicsInfo.module.css';

const GraphicsInfo = ({ webglInfo, canvasInfo }) => {
  return (
    <motion.div 
      className={styles.graphicsInfo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* WebGL информация */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Layers size={20} />
          WebGL поддержка
        </h3>
        {webglInfo.supported ? (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Статус:</span>
              <span className={`${styles.value} ${styles.supported}`}>✅ Поддерживается</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Вендор:</span>
              <span className={styles.value}>{webglInfo.vendor}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Рендерер:</span>
              <span className={styles.value}>{webglInfo.renderer}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Версия:</span>
              <span className={styles.value}>{webglInfo.version}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>GLSL версия:</span>
              <span className={styles.value}>{webglInfo.shadingLanguageVersion}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. размер текстуры:</span>
              <span className={styles.value}>{webglInfo.maxTextureSize}px</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. размер viewport:</span>
              <span className={styles.value}>
                {webglInfo.maxViewportDims[0]} × {webglInfo.maxViewportDims[1]}px
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. размер рендербуфера:</span>
              <span className={styles.value}>{webglInfo.maxRenderbufferSize}px</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. атрибуты вершин:</span>
              <span className={styles.value}>{webglInfo.maxVertexAttribs}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. uniform векторы вершин:</span>
              <span className={styles.value}>{webglInfo.maxVertexUniformVectors}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. uniform векторы фрагментов:</span>
              <span className={styles.value}>{webglInfo.maxFragmentUniformVectors}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Макс. varying векторы:</span>
              <span className={styles.value}>{webglInfo.maxVaryingVectors}</span>
            </div>
          </div>
        ) : (
          <div className={styles.error}>
            <h4>❌ WebGL не поддерживается</h4>
            <p>{webglInfo.error || 'Ваш браузер не поддерживает WebGL'}</p>
          </div>
        )}
      </div>

      {/* Canvas информация */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Palette size={20} />
          Canvas 2D поддержка
        </h3>
        {canvasInfo.supported ? (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Статус:</span>
              <span className={`${styles.value} ${styles.supported}`}>✅ Поддерживается</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Размер по умолчанию:</span>
              <span className={styles.value}>
                {canvasInfo.width} × {canvasInfo.height}px
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>toDataURL:</span>
              <span className={styles.value}>
                {canvasInfo.toDataURL ? '✅ Доступен' : '❌ Недоступен'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>getImageData:</span>
              <span className={styles.value}>
                {canvasInfo.getImageData ? '✅ Доступен' : '❌ Недоступен'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>putImageData:</span>
              <span className={styles.value}>
                {canvasInfo.putImageData ? '✅ Доступен' : '❌ Недоступен'}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.error}>
            <h4>❌ Canvas не поддерживается</h4>
            <p>{canvasInfo.error || 'Ваш браузер не поддерживает Canvas 2D'}</p>
          </div>
        )}
      </div>

      {/* Общая информация о графике */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Monitor size={20} />
          Графические возможности
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>WebGL:</span>
            <span className={styles.value}>
              {webglInfo.supported ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Canvas 2D:</span>
            <span className={styles.value}>
              {canvasInfo.supported ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>CSS 3D Transforms:</span>
            <span className={styles.value}>
              {CSS.supports('transform', 'translate3d(0,0,0)') ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>CSS Grid:</span>
            <span className={styles.value}>
              {CSS.supports('display', 'grid') ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>CSS Flexbox:</span>
            <span className={styles.value}>
              {CSS.supports('display', 'flex') ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>CSS Animations:</span>
            <span className={styles.value}>
              {CSS.supports('animation', 'name 1s') ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GraphicsInfo; 