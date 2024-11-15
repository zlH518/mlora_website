<template>
  <div class="management-cards">
    <!-- File Management Card -->
    <div class="management-card">
      <h2>File Management</h2>
      <div class="settings-container">
        <!-- File Upload -->
        <div class="setting-row">
          <div class="setting">
            <label><i class="fas fa-upload"></i> Upload File (POST /data or /prompt)</label>
            <p>Upload training data or prompt template files</p>
            <input type="file" @change="handleFileUpload" class="input-field" />
            <select v-model="selectedFileType" class="input-field">
              <option value="data">Data</option>
              <option value="prompt">Prompt Template</option>
            </select>
            <input type="text" v-model="fileName" placeholder="File Name" class="input-field" />
            <button @click="uploadFile" class="action-button">
              <i class="fas fa-upload"></i> Upload File
            </button>
          </div>
        </div>

        <!-- File List and Delete -->
        <div class="setting-row">
          <div class="setting">
            <label><i class="fas fa-list"></i> File List (GET /data or /prompt)</label>
            <p>View uploaded files</p>
            <button @click="toggleFileList" class="action-button">
              <i class="fas fa-list"></i> List Files
            </button>

            <!-- Dropdown for File List -->
            <select v-if="showFileList && fileList.length > 0" class="dropdown">
              <option v-for="file in fileList" :key="file.name" :value="file.name">
                {{ file.name }}
              </option>
            </select>
          </div>
          <div class="setting">
            <label><i class="fas fa-trash"></i> Delete File (DELETE /data or /prompt)</label>
            <p>Specify the file name to delete</p>
            <input type="text" v-model="fileToDelete" placeholder="File Name" class="input-field" />
            <button @click="deleteFile" class="action-button">
              <i class="fas fa-trash"></i> Delete File
            </button>
          </div>
        </div>

        <!-- Connection Status -->
        <div v-if="statusMessage" class="status-message">
          <p>{{ statusMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'FileSettings',
  data() {
    return {
      selectedFileType: 'data', // Can be 'data' or 'prompt'
      fileName: '',
      fileToDelete: '',
      fileList: [] as Array<{ name: string; file: string }>, // List to store files fetched from the backend
      file: null as File | null, // The file to be uploaded
      showFileList: false, // Flag to toggle file list visibility
      statusMessage: '', // Message to display the connection status
    }
  },
  methods: {
    // Handle file selection for upload
    handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement
      if (input.files?.length) {
        this.file = input.files[0]
      }
    },

    // Fetch the list of files from the backend (GET /data or /prompt)
    async fetchFiles() {
      try {
        const response = await axios.get(`/api/${this.selectedFileType}`)

        this.fileList = response.data
        this.statusMessage = `Successfully fetched ${this.selectedFileType} files.`
        console.log('Fetched files:', response.data)
      } catch (error) {
        this.statusMessage = 'Error fetching files. Please check your connection.'
        console.error('Error fetching files:', error)
      }
    },

    // Toggle the file list visibility and fetch files if needed
    async toggleFileList() {
      this.showFileList = !this.showFileList
      if (this.showFileList) {
        await this.fetchFiles() // Fetch files only if we are showing the list
      }
    },

    // Upload a file to the backend (POST /data or /prompt)
    async uploadFile() {
      if (!this.file || !this.fileName) {
        alert('Please select a file and provide a name')
        return
      }

      const formData = new FormData()
      formData.append('data_file', this.file) // Use 'data_file' as specified in the backend
      formData.append('name', this.fileName)

      try {
        const response = await axios.post(`/api/${this.selectedFileType}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.statusMessage = `File uploaded successfully: ${this.fileName}`
        alert(response.data.message)
        console.log('File uploaded:', response.data)
        this.fileName = '' // Reset file name
        this.fetchFiles() // Refresh the file list
      } catch (error) {
        this.statusMessage = 'Error uploading file. Please try again.'
        console.error('Error uploading file:', error)
        alert('Failed to upload file')
      }
    },

    // Delete a file (DELETE /data or /prompt)
    async deleteFile() {
      if (!this.fileToDelete) {
        alert('Please provide the name of the file to delete')
        return
      }

      try {
        const response = await axios.delete(`/api/${this.selectedFileType}`, {
          data: { name: this.fileToDelete },
        })

        this.statusMessage = `File deleted successfully: ${this.fileToDelete}`
        alert(response.data.message)
        console.log('File deleted:', response.data)
        this.fileToDelete = '' // Reset the file name input
        this.fetchFiles() // Refresh the file list
      } catch (error) {
        this.statusMessage = 'Error deleting file. Please try again.'
        console.error('Error deleting file:', error)
        alert('Failed to delete file')
      }
    },
  },
})
</script>

<style scoped>
.management-cards {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.management-card {
  background: linear-gradient(145deg, #1b1f3a, #111324);
  border-radius: 15px;
  padding: 1.5rem;
  width: 90%;
  color: #ffffff;
  box-shadow: 0 0 30px rgba(108, 99, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.management-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #e0e0ff;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-row {
  display: flex;
  gap: 1.5rem;
}

.setting {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.setting label {
  font-weight: 600;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting p {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.input-field {
  background-color: #2a2f3b;
  border: none;
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.action-button {
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background-color: #6c63ff;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.dropdown {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: #2a2f3b;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 0.95rem;
}

.action-button:hover {
  background-color: #5147d7;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
}
</style>
