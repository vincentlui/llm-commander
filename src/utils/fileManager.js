const fs = require('fs').promises;
const path = require('path');

class FileManager {
  constructor() {
    this.uploadsDir = path.join(process.cwd(), '.uploaded_files');
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

module.exports = FileManager;
