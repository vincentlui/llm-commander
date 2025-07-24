import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileManager {
  constructor() {
    this.uploadsDir = path.join(__dirname, '.uploaded_files');
    this.initializeDirectory();
  }

  async initializeDirectory() {
    try {
      await fs.access(this.uploadsDir);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(this.uploadsDir, { recursive: true });
      console.log('Created .uploaded_files directory');
    }
  }

  async saveFile(fileName, content) {
    try {
      const timestamp = Date.now();
      const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${timestamp}_${safeName}`;
      const filePath = path.join(this.uploadsDir, uniqueName);
      
      await fs.writeFile(filePath, content, 'utf8');
      return {
        success: true,
        filePath: `.uploaded_files/${uniqueName}`,
        fileName: uniqueName
      };
    } catch (error) {
      console.error('Error saving file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listFiles() {
    try {
      const files = await fs.readdir(this.uploadsDir);
      const fileDetails = [];
      
      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = await fs.stat(filePath);
        fileDetails.push({
          name: file,
          size: stats.size,
          modified: stats.mtime,
          path: `.uploaded_files/${file}`
        });
      }
      
      return { success: true, files: fileDetails };
    } catch (error) {
      console.error('Error listing files:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const app = express();
const fileManager = new FileManager();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Upload files endpoint
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const content = file.buffer.toString('utf8');
      const result = await fileManager.saveFile(file.originalname, content);
      
      if (result.success) {
        uploadedFiles.push({
          originalName: file.originalname,
          fileName: result.fileName,
          filePath: result.filePath,
          size: file.size,
          content: content
        });
      }
    }
    
    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete file endpoint
app.delete('/api/files/:fileName', async (req, res) => {
  try {
    const result = await fileManager.deleteFile(req.params.fileName);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List files endpoint
app.get('/api/files', async (req, res) => {
  try {
    const result = await fileManager.listFiles();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`File management server running on port ${PORT}`);
  console.log(`Upload directory: ${fileManager.uploadsDir}`);
});

export default app;
