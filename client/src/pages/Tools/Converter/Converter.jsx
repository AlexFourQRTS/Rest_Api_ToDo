// import React from "react";
// import { motion } from "framer-motion";
// import styles from "./Converter.module.css";
// import Hero from "../../../components/UI/Hero/Hero";

// const Converter = () => {
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   return (
//     <div className={styles.converter}>
//       <motion.section
//         className={styles.intro}
//         variants={sectionVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <Hero 
//           title="Конвертор" 
//           subtitle="Страница конвертора в разработке" 
//         />
//       </motion.section>
      
//       <motion.section
//         className={styles.content}
//         variants={sectionVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <div className={styles.developmentMessage}>
//           <h2>🚧 В разработке</h2>
//           <p>Функционал конвертора находится в разработке. Скоро здесь появится возможность конвертировать различные форматы файлов и данных.</p>
//         </div>
//       </motion.section>
//     </div>
//   );
// };

// export default Converter; 