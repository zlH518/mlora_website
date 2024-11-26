<template>
  <div class="management-card">
    <h2>File Management</h2>

    <!-- Upload File -->
    <div class="section">
      <h3>Upload File (POST /data or /prompt)</h3>
      <input type="file" @change="handleFileUpload" class="input-field" />
      <select v-model="selectedFileType" class="input-field">
        <option value="data">Data</option>
        <option value="prompt">Prompt Template</option>
      </select>
      <input
        type="text"
        v-model="fileName"
        placeholder="File Name"
        class="input-field"
      />
      <button @click="uploadFile" class="action-button">Upload File</button>
    </div>

    <!-- Fetch Files -->
    <div class="section">
      <h3>View Uploaded Files (GET /data or /prompt)</h3>
      <button @click="fetchFiles" class="action-button">List Files</button>
      <ul v-if="fileList.length">
        <li v-for="(file, index) in fileList" :key="index">{{ file.name }}</li>
      </ul>
    </div>

    <!-- Delete File -->
    <div class="section">
      <h3>Delete File (DELETE /data or /prompt)</h3>
      <input
        type="text"
        v-model="fileToDelete"
        placeholder="File Name to Delete"
        class="input-field"
      />
      <button @click="deleteFile" class="action-button">Delete File</button>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios.js"; // Import Axios instance

export default {
  name: "FilesCard",
  data() {
    return {
      selectedFileType: "data", // 'data' or 'prompt'
      fileName: "", // Name of the file to upload
      fileToDelete: "", // Name of the file to delete
      fileList: [], // List of files
      file: null, // File object to upload
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async fetchFiles() {
      try {
        const response = await apiClient.get(`/${this.selectedFileType}`);
        this.fileList = response.data;
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Failed to fetch files.");
      }
    },
    async uploadFile() {
      if (!this.file || !this.fileName) {
        alert("Please select a file and provide a name.");
        return;
      }

      const formData = new FormData();
      formData.append("data_file", this.file);
      formData.append("name", this.fileName);

      try {
        await apiClient.post(`/${this.selectedFileType}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("File uploaded successfully!");
        this.fetchFiles();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
    },
    async deleteFile() {
      if (!this.fileToDelete) {
        alert("Please provide the name of the file to delete.");
        return;
      }

      try {
        await apiClient.delete(`/${this.selectedFileType}`, {
          data: { name: this.fileToDelete },
        });
        alert("File deleted successfully!");
        this.fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      }
    },
  },
};
</script>

<style scoped>
.management-card {
  background: #1e1e3f;
  border-radius: 10px;
  padding: 1.5rem;
  color: #fff;
  width: 100%;
  max-width: 400px;
  margin: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.section {
  margin-bottom: 1.5rem;
}

.input-field {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: #2a2a54;
  color: #fff;
}

.action-button {
  background: #6c63ff;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

.action-button:hover {
  background: #5147d7;
}
</style>
