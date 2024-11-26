<template>
  <div class="dataset-card">
    <h2>Dataset Management</h2>

    <!-- Create Dataset -->
    <div class="section">
      <h3>Create Dataset (POST /dataset)</h3>
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
      <h3>View Datasets (GET /dataset)</h3>
      <button @click="fetchDatasets" class="action-button">Fetch Datasets</button>
      <ul v-if="datasets.length">
        <li v-for="(dataset, index) in datasets" :key="index">
          {{ dataset }}
        </li>
      </ul>
    </div>

    <!-- Delete Dataset -->
    <div class="section">
      <h3>Delete Dataset (DELETE /dataset)</h3>
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
import apiClient from "@/axios.js"; // Import Axios instance

export default {
  name: "DatasetCard",
  data() {
    return {
      datasetName: "",
      dataName: "",
      promptName: "",
      promptType: "instruction",
      preprocess: "default",
      datasets: [],
      datasetToDelete: "",
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
        this.fetchDatasets();
      } catch (error) {
        console.error("Error creating dataset:", error);
        alert("Failed to create dataset.");
      }
    },
    async fetchDatasets() {
      try {
        const response = await apiClient.get("/dataset");
        this.datasets = response.data.map((d) => d.name);
      } catch (error) {
        console.error("Error fetching datasets:", error);
        alert("Failed to fetch datasets.");
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
        this.fetchDatasets();
      } catch (error) {
        console.error("Error deleting dataset:", error);
        alert("Failed to delete dataset.");
      }
    },
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
