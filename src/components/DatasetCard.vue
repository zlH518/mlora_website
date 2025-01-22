<template>
  <div class="dataset-card">
    <h2>Dataset Management</h2>

    <!-- Create Dataset -->
    <div class="section">
      <h3>Create Dataset</h3>
      <input
        type="text"
        v-model="datasetName"
        placeholder="Dataset Name"
        class="input-field"
      />
      <input
        type="text"
        v-model="dataName"
        placeholder="Data Name"
        class="input-field"
      />
      <input
        type="text"
        v-model="promptName"
        placeholder="Prompt Name"
        class="input-field"
      />
      <select v-model="promptType" class="input-field">
        <option value="instruction">Instruction</option>
        <option value="preference">Preference</option>
        <option value="contrastive_instruction">Contrastive Instruction</option>
      </select>
      <select v-model="preprocess" class="input-field">
        <option value="default">Default</option>
        <option value="shuffle">Shuffle</option>
        <option value="sort">Sort</option>
      </select>
      <button @click="createDataset" class="action-button">Create Dataset</button>
    </div>

    <!-- Fetch Datasets -->
    <div class="section">
      <h3>View Datasets</h3>
      <button @click="fetchDatasets" class="action-button">Fetch Datasets</button>
      <table v-if="datasets.length && showTable" class="datasets-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Data Name</th>
            <th>Prompt Name</th>
            <th>Prompt Type</th>
            <th>Preprocess</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dataset, index) in datasets" :key="index">
            <td>{{ dataset.name }}</td>
            <td>{{ dataset.data_name }}</td>
            <td>{{ dataset.prompt_name }}</td>
            <td>{{ dataset.prompt_type }}</td>
            <td>{{ dataset.preprocess }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No datasets available.</p>
    </div>

    <!-- Showcase Dataset -->
    <div class="section">
      <h3>Dataset Showcase</h3>
      <input
        type="text"
        v-model="showcaseDatasetName"
        placeholder="Enter Dataset Name"
        class="input-field"
      />
      <button @click="showcaseDataset" class="action-button">Showcase Dataset</button>
      <pre v-if="showcaseData">{{ showcaseData }}</pre>
      <p v-else>No data to showcase.</p>
    </div>

    <!-- Delete Dataset -->
    <div class="section">
      <h3>Delete Dataset</h3>
      <input
        type="text"
        v-model="datasetToDelete"
        placeholder="Dataset Name to Delete"
        class="input-field"
      />
      <button @click="deleteDataset" class="action-button">Delete Dataset</button>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios.js";

export default {
  name: "DatasetCard",
  data() {
    return {
      showTable: false,
      datasetName: "",
      dataName: "",
      promptName: "",
      promptType: "instruction",
      preprocess: "default",
      datasets: [],
      datasetToDelete: "",
      showcaseDatasetName: "",
      showcaseData: null,
    };
  },
  methods: {
    async createDataset() {
      try {
        await apiClient.post("/dataset", {
          name: this.datasetName,
          data_name: this.dataName,
          prompt_name: this.promptName,
          prompt_type: this.promptType,
          preprocess: this.preprocess,
        });
        alert("Dataset created successfully!");
        this.fetchDatasets(); // Refresh table after creation
      } catch (error) {
        console.error("Error creating dataset:", error);
        alert("Failed to create dataset.");
      }
    },
    async fetchDatasets() {
      try {
        const response = await apiClient.get("/dataset");
        const parsedDatasets = response.data.map(datasetString => JSON.parse(datasetString));
        console.log(parsedDatasets); 
        this.datasets = parsedDatasets; 
        this.showTable = this.datasets.length > 0; // Only show table if data exists
        console.log(this.datasets); // Debugging response
      } catch (error) {
        console.error("Error fetching datasets:", error);
        alert("Failed to fetch datasets. Please check the backend connection.");
      }
    },
    async showcaseDataset() {
      if (!this.showcaseDatasetName) {
        alert("Please provide a dataset name to showcase.");
        return;
      }
      try {
        const response = await apiClient.get(`/showcase`, {
          params: { name: this.showcaseDatasetName },
        });
        if (response.data.example && response.data.example.length > 0) {
          this.showcaseData = response.data.example[0];
        } else {
          this.showcaseData = "No data to showcase.";
        }
      } catch (error) {
        console.error("Error showcasing dataset:", error);
        alert("Failed to showcase dataset.");
      }
    },
    async deleteDataset() {
      if (!this.datasetToDelete) {
        alert("Please provide the dataset name to delete.");
        return;
      }
      try {
        await apiClient.delete("/dataset", { data: { name: this.datasetToDelete } });
        alert("Dataset deleted successfully!");
        this.fetchDatasets(); // Refresh table after deletion
      } catch (error) {
        console.error("Error deleting dataset:", error);
        alert("Failed to delete dataset.");
      }
    },
  },
  startDatasetPolling() {
    this.datasetPollingInterval = setInterval(this.fetchDatasets, 10000); // Poll every 5 seconds
  },
  stopDatasetPolling() {
    if (this.datasetPollingInterval) {
      clearInterval(this.datasetPollingInterval);
      this.datasetPollingInterval = null;
    }
  },
  async mounted() {
    this.startDatasetPolling();
  },
  beforeDestroy() {
    this.stopDatasetPolling();
  },
};
</script>

<style scoped>
.dataset-card {
  background: #1e1e3f;
  border-radius: 10px;
  padding: 1.5rem;
  color: #fff;
  width: 100%;
  max-width: 900px;
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

/* Styling for the table */
.datasets-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  background: #2a2a54;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.datasets-table th,
.datasets-table td {
  padding: 0.75rem 1rem;
  text-align: center;
  border-bottom: 1px solid #444;
}

.datasets-table th {
  background: #333a56;
  font-weight: bold;
}

.datasets-table tr:hover {
  background: #444b6e;
}

.datasets-table tr:nth-child(even) {
  background: #2a2a54;
}

.datasets-table tbody tr:last-child td {
  border-bottom: none;
}

.datasets-table td {
  font-size: 0.9rem;
}



pre {
  white-space: pre-wrap; /* 自动换行 */
  word-wrap: break-word; /* 强制长单词换行 */
  word-break: break-all; /* 强制中英文都换行 */
  max-width: 100%; /* 确保文本不会超出容器宽度 */
  font-family: 'Courier New', monospace; /* Monospace font for preformatted text */
}

</style>
