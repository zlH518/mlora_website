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
            <input type="file" class="input-field" />
            <select class="input-field">
              <option value="train">Train Data</option>
              <option value="prompt">Prompt Template</option>
            </select>
            <input type="text" placeholder="File Name" class="input-field" />
            <input type="text" placeholder="File Path" class="input-field" />
          </div>
        </div>

        <!-- File List and Delete -->
        <div class="setting-row">
          <div class="setting">
            <label><i class="fas fa-list"></i> File List (GET /data)</label>
            <p>View uploaded files</p>
            <button @click="fetchFiles" class="action-button">
              <i class="fas fa-list"></i> List Files
            </button>
          </div>
          <div class="setting">
            <label><i class="fas fa-trash"></i> Delete File (DELETE /data)</label>
            <p>Specify the file name to delete</p>
            <input type="text" placeholder="File Name" class="input-field" />
            <button @click="deleteFile" class="action-button">
              <i class="fas fa-trash"></i> Delete File
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dataset Management Card -->
    <div class="management-card">
      <h2>Dataset Management</h2>
      <div class="settings-container">
        <!-- Dataset Create -->
        <div class="setting-row">
          <div class="setting">
            <label><i class="fas fa-database"></i> Create Dataset (POST /dataset)</label>
            <p>Configure and create a new dataset</p>
            <input type="text" placeholder="Dataset Name" class="input-field" />
            <select class="input-field">
              <option disabled selected>Select Train Data File</option>
              <!-- Dynamically populate from file_data list -->
            </select>
            <select class="input-field">
              <option disabled selected>Select Prompt Template File</option>
              <!-- Dynamically populate from file_prompt list -->
            </select>
            <select class="input-field">
              <option value="instruction">Instruction</option>
              <option value="preference">Preference</option>
              <option value="contrastive_instruction">Contrastive Instruction</option>
            </select>
            <select class="input-field">
              <option value="default">Default</option>
              <option value="shuffle">Shuffle</option>
              <option value="sort">Sort</option>
            </select>
            <button @click="createDataset" class="action-button">
              <i class="fas fa-plus"></i> Create Dataset
            </button>
          </div>
        </div>

        <!-- Dataset List, Delete, and Showcase -->
        <div class="setting-row">
          <div class="setting">
            <label><i class="fas fa-list"></i> Dataset List (GET /dataset)</label>
            <p>View available datasets</p>
            <button @click="fetchDatasets" class="action-button">
              <i class="fas fa-list"></i> List Datasets
            </button>
          </div>
          <div class="setting">
            <label><i class="fas fa-trash"></i> Delete Dataset (DELETE /dataset)</label>
            <p>Specify the dataset name to delete</p>
            <input type="text" placeholder="Dataset Name" class="input-field" />
            <button @click="deleteDataset" class="action-button">
              <i class="fas fa-trash"></i> Delete Dataset
            </button>
          </div>
          <div class="setting">
            <label><i class="fas fa-eye"></i> Dataset Showcase (GET /showcase)</label>
            <p>View details of a specific dataset</p>
            <input type="text" placeholder="Dataset Name" class="input-field" />
            <button @click="showcaseDataset" class="action-button">
              <i class="fas fa-eye"></i> Showcase Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DatasetSettings',
  methods: {
    fetchFiles() {
      // API call to GET /data to list files
    },
    deleteFile() {
      // API call to DELETE /data with specified file name
    },
    createDataset() {
      // API call to POST /dataset with dataset creation parameters
    },
    fetchDatasets() {
      // API call to GET /dataset to list datasets
    },
    deleteDataset() {
      // API call to DELETE /dataset with specified dataset name
    },
    showcaseDataset() {
      // API call to GET /showcase with specified dataset name
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
  width: 48%;
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
  padding: 10px; /* Increased padding for touch comfort */
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

.action-button:hover {
  background-color: #5147d7;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
}
</style>
