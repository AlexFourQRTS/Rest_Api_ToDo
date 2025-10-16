export interface MulterFile {
  fieldName: string;
  originalname: string;
  fileEncoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  filePath: string; 
  filename: string; 
}