// Google Drive Integration Template
// This is a template for implementing Google Drive file import

class GoogleDriveIntegration {
  constructor(clientId, apiKey) {
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.isSignedIn = false;
  }

  async initialize() {
    try {
      // Load Google APIs
      await this.loadGoogleAPIs();
      
      // Initialize the API
      await gapi.load('auth2:picker', () => {
        gapi.auth2.init({
          client_id: this.clientId
        });
      });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error);
      return false;
    }
  }

  async loadGoogleAPIs() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn({
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      });
      
      this.isSignedIn = true;
      return user;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  }

  async showFilePicker() {
    if (!this.isSignedIn) {
      await this.signIn();
    }

    return new Promise((resolve, reject) => {
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .setDeveloperKey(this.apiKey)
        .setCallback((data) => {
          if (data.action === google.picker.Action.PICKED) {
            resolve(data.docs);
          } else if (data.action === google.picker.Action.CANCEL) {
            reject(new Error('User cancelled file selection'));
          }
        })
        .build();
      
      picker.setVisible(true);
    });
  }

  async downloadFile(fileId) {
    try {
      const response = await gapi.client.request({
        path: `https://www.googleapis.com/drive/v3/files/${fileId}`,
        params: { alt: 'media' }
      });
      
      return response.body;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  async importFiles() {
    try {
      const files = await this.showFilePicker();
      const importedFiles = [];
      
      for (const file of files) {
        if (file.mimeType === 'text/plain' || file.name.endsWith('.txt')) {
          const content = await this.downloadFile(file.id);
          importedFiles.push({
            name: file.name,
            content: content,
            size: file.sizeBytes,
            mimeType: file.mimeType
          });
        }
      }
      
      return importedFiles;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}

export default GoogleDriveIntegration;
