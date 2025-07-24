import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, Cloud } from 'lucide-react'
import './FilesTab.css'

interface FileIndex {
  id: string
  name: string
  content: string
  chunks: string[]
  uploadDate: Date
  size: number
  filePath: string
}

const FilesTab = () => {
  const [files, setFiles] = useState<FileIndex[]>([])
  const [isIndexing, setIsIndexing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isImportingFromDrive, setIsImportingFromDrive] = useState(false)

  // Save file to local directory via API
  const saveFileToDirectory = async (file: File, content: string): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('files', file)
      
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file to server')
      }
      
      const result = await response.json()
      if (result.success && result.files.length > 0) {
        return result.files[0].filePath
      } else {
        throw new Error('Server returned error')
      }
    } catch (error) {
      console.error('Error saving file:', error)
      // Fallback to localStorage storage
      const fileName = `${Date.now()}_${file.name}`
      const filePath = `.uploaded_files/${fileName}`
      localStorage.setItem(`file_${fileName}`, content)
      return filePath
    }
  }

  useEffect(() => {
    // Load indexed files from localStorage
    const savedFiles = localStorage.getItem('indexed-files')
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }))
        setFiles(parsedFiles)
      } catch (error) {
        console.error('Error loading saved files:', error)
      }
    }
  }, [])

  const saveFilesToStorage = (newFiles: FileIndex[]) => {
    localStorage.setItem('indexed-files', JSON.stringify(newFiles))
  }

  const chunkText = (text: string, chunkSize: number = 1000): string[] => {
    const chunks: string[] = []
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    let currentChunk = ''
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.length > 0 ? chunks : [text]
  }

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsIndexing(true)
    
    try {
      const newFiles: FileIndex[] = []
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
          alert(`File ${file.name} is not a text file. Only .txt files are supported.`)
          continue
        }
        
        const content = await file.text()
        const chunks = chunkText(content)
        
        // Save file to directory
        const filePath = await saveFileToDirectory(file, content)
        
        const fileIndex: FileIndex = {
          id: Date.now().toString() + i,
          name: file.name,
          content,
          chunks,
          uploadDate: new Date(),
          size: file.size,
          filePath
        }
        
        newFiles.push(fileIndex)
      }
      
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      saveFilesToStorage(updatedFiles)
      
    } catch (error) {
      console.error('Error processing files:', error)
      alert('Error processing files. Please try again.')
    } finally {
      setIsIndexing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles)
    }
  }

  const deleteFile = async (fileId: string) => {
    const fileToDelete = files.find(file => file.id === fileId)
    if (fileToDelete) {
      try {
        // Try to delete from server
        const fileName = fileToDelete.filePath.split('/').pop()
        if (fileName) {
          const response = await fetch(`http://localhost:3001/api/files/${fileName}`, {
            method: 'DELETE'
          })
          
          if (response.ok) {
            console.log('File deleted from server')
          } else {
            console.warn('Could not delete file from server, removing from localStorage')
          }
          
          // Also remove from localStorage as fallback
          localStorage.removeItem(`file_${fileName}`)
        }
      } catch (error) {
        console.error('Error deleting file:', error)
        // Fallback to localStorage cleanup
        const fileName = fileToDelete.filePath.split('/').pop()
        if (fileName) {
          localStorage.removeItem(`file_${fileName}`)
        }
      }
    }
    
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    saveFilesToStorage(updatedFiles)
  }

  const handleGoogleDriveImport = async () => {
    setIsImportingFromDrive(true)
    
    try {
      // This is a placeholder for Google Drive integration
      // In a real implementation, you would use Google Drive API
      alert('Google Drive import functionality would be implemented here. This requires:\n\n1. Google Drive API credentials\n2. OAuth 2.0 authentication\n3. File picker interface\n\nFor now, please use the regular file upload.')
    } catch (error) {
      console.error('Error importing from Google Drive:', error)
      alert('Error importing from Google Drive. Please try again.')
    } finally {
      setIsImportingFromDrive(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="files-tab">
      <div className="files-header">
        <h2>Files & RAG Index</h2>
        <p className="files-description">
          Upload text files to create a searchable knowledge base for enhanced chat responses. Files are stored locally in your browser.
        </p>
      </div>

      <div className="files-content">
        <div className="upload-section">
          <div 
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload size={48} />
            <h3>Upload Text Files</h3>
            <p>Drag and drop .txt files here or click to browse</p>
            <input
              type="file"
              multiple
              accept=".txt,text/plain"
              onChange={handleFileInputChange}
              className="file-input"
              disabled={isIndexing}
            />
            {isIndexing && (
              <div className="indexing-status">
                <div className="spinner"></div>
                <span>Indexing files...</span>
              </div>
            )}
          </div>
          
          <div className="import-divider">
            <span>OR</span>
          </div>
          
          <div className="google-drive-section">
            <div className="drive-import-area">
              <Cloud size={48} />
              <h3>Import from Google Drive</h3>
              <p>Import text files directly from your Google Drive</p>
              <button
                onClick={handleGoogleDriveImport}
                disabled={isImportingFromDrive}
                className="drive-import-button"
              >
                {isImportingFromDrive ? (
                  <>
                    <div className="spinner-small"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={20} />
                    <span>Import from Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="files-list">
          <div className="files-list-header">
            <h3>Indexed Files ({files.length})</h3>
            {files.length > 0 && (
              <div className="files-stats">
                Total chunks: {files.reduce((sum, file) => sum + file.chunks.length, 0)}
              </div>
            )}
          </div>

          {files.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No files indexed yet</p>
              <p className="empty-state-subtitle">Upload some text files to get started</p>
            </div>
          ) : (
            <div className="files-grid">
              {files.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-header">
                    <FileText size={20} />
                    <span className="file-name" title={file.name}>{file.name}</span>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="delete-button"
                      title="Delete file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="file-details">
                    <div className="file-meta">
                      <span>Size: {formatFileSize(file.size)}</span>
                      <span>Chunks: {file.chunks.length}</span>
                    </div>
                    <div className="file-path">
                      Path: {file.filePath}
                    </div>
                    <div className="file-date">
                      Uploaded: {formatDate(file.uploadDate)}
                    </div>
                    <div className="file-preview">
                      {file.content.substring(0, 150)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rag-info">
          <h3>How RAG Works</h3>
          <p>
            When you ask questions in the chat, the system will:
          </p>
          <ol>
            <li>Search through your uploaded files for relevant content</li>
            <li>Include the most relevant chunks as context for the LLM</li>
            <li>Generate responses based on both the conversation and your files</li>
          </ol>
          <div className="storage-note">
            <strong>Note:</strong> Files are stored in the <code>.uploaded_files</code> directory and indexed in your browser's storage for fast searching.
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilesTab
