<template>
  <div class="management-card">
    <h2>Task Management</h2>

    <!-- Create Task -->
    <div class="section">
      <h3>Create Task (POST /task)</h3>
      <label class="label" for="taskName">Task Name</label>
      <input
        type="text"
        id="taskName"
        v-model="taskName"
        placeholder="Task Name"
        class="input-field"
      />
      <label class="label" for="taskType">Task Type</label>
      <select id="taskType" v-model="taskType" class="input-field">
        <option value="train">Train</option>
        <option value="dpo">DPO</option>
        <option value="cpo">CPO</option>
      </select>
      <label class="label" for="datasetName">Dataset Name</label>
      <input
        type="text"
        id="datasetName"
        v-model="datasetName"
        placeholder="Dataset Name"
        class="input-field"
      />
      <label class="label" for="adapterName">Adapter Name</label>
      <input
        type="text"
        id="adapterName"
        v-model="adapterName"
        placeholder="Adapter Name"
        class="input-field"
      />
      <label class="label" for="batchSize">Batch Size</label>
      <input
        type="number"
        id="batchSize"
        v-model="batchSize"
        placeholder="16"
        class="input-field"
      />
      <label class="label" for="miniBatchSize">Mini Batch Size</label>
      <input
        type="number"
        id="miniBatchSize"
        v-model="miniBatchSize"
        placeholder="16"
        class="input-field"
      />
      <label class="label" for="numEpochs">Number of Epochs</label>
      <input
        type="number"
        id="numEpochs"
        v-model="numEpochs"
        placeholder="10"
        class="input-field"
      />
      <label class="label" for="cutoffLen">Cutoff Length</label>
      <input
        type="number"
        id="cutoffLen"
        v-model="cutoffLen"
        placeholder="256"
        class="input-field"
      />
      <label class="label" for="saveStep">Save Step</label>
      <input
        type="number"
        id="saveStep"
        v-model="saveStep"
        placeholder="100000"
        class="input-field"
      />
      <!-- Conditional Fields -->
      <div v-if="taskType === 'dpo' || taskType === 'cpo'">
        <label class="label" for="beta">Beta</label>
        <input
          type="number"
          id="beta"
          v-model="beta"
          placeholder="0.1"
          class="input-field"
        />
        <label class="label" for="labelSomething">Label Something</label>
        <input
          type="number"
          id="labelSomething"
          v-model="labelSomething"
          placeholder="0.0"
          class="input-field"
        />
      </div>
      <div v-if="taskType === 'cpo' || taskType === 'dpo'">
        <label class="label" for="lossType">Loss Type</label>
        <select id="lossType" v-model="lossType" class="input-field">
          <option value="sigmoid">Sigmoid</option>
          <option value="hinge" v-if="taskType === 'cpo'">Hinge</option>
          <option value="ipo" v-if="taskType === 'dpo'">IPO</option>
        </select>
      </div>
      <label class="label" for="reference">Reference</label>
      <select id="reference" v-model="reference" class="input-field">
        <option value="base">Base (Use the base LLM model)</option>
        <option v-for="adapter in availableAdapters" :key="adapter" :value="adapter">
          {{ adapter }}
        </option>
      </select>
      <button @click="createTask" class="action-button">Create Task</button>
    </div>

    <!-- View Tasks -->
    <div class="section">
      <h3>View Tasks (GET /task)</h3>
      <button @click="fetchTasks" class="action-button">List Tasks</button>
      <ul v-if="tasks.length">
        <li v-for="(task, index) in tasks" :key="index">
          {{ task.name }} - {{ task.type }} - {{ task.dataset }} - {{ task.adapter }} - {{ task.state }}
        </li>
      </ul>
    </div>

    <!-- Delete Task -->
    <div class="section">
      <h3>Delete Task (DELETE /task)</h3>
      <label class="label" for="taskToDelete">Task Name to Delete</label>
      <input
        type="text"
        id="taskToDelete"
        v-model="taskToDelete"
        placeholder="Task Name to Delete"
        class="input-field"
      />
      <button @click="deleteTask" class="action-button">Delete Task</button>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios.js";

export default {
  name: "TaskManagementCard",
  data() {
    return {
      taskName: "",
      taskType: "train",
      datasetName: "",
      adapterName: "",
      batchSize: 16,
      miniBatchSize: 16,
      numEpochs: 10,
      cutoffLen: 256,
      saveStep: 100000,
      beta: 0.1,
      labelSomething: 0.0,
      lossType: "sigmoid",
      reference: "base",
      taskToDelete: "",
      tasks: [],
      availableAdapters: [],
    };
  },
  methods: {
    async createTask() {
      const payload = {
        name: this.taskName,
        type: this.taskType,
        dataset: this.datasetName,
        adapter: this.adapterName,
        batch_size: this.batchSize,
        mini_batch_size: this.miniBatchSize,
        num_epochs: this.numEpochs,
        cutoff_len: this.cutoffLen,
        save_step: this.saveStep,
        reference: this.reference,
      };

      if (this.taskType === "dpo" || this.taskType === "cpo") {
        payload.beta = this.beta;
        payload.label_something = this.labelSomething;
      }

      if (this.taskType === "cpo") {
        payload.loss_type = this.lossType;
      } else if (this.taskType === "dpo") {
        payload.loss_type = this.lossType;
      }

      try {
        const response = await apiClient.post("/task", payload);
        alert(response.data.message || "Task created successfully!");
        this.fetchTasks();
      } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to create task.");
      }
    },
    async fetchTasks() {
      try {
        const response = await apiClient.get("/task");
        this.tasks = response.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks.");
      }
    },
    async deleteTask() {
      if (!this.taskToDelete) {
        alert("Please provide the name of the task to delete.");
        return;
      }

      try {
        const response = await apiClient.delete("/task", {
          data: { name: this.taskToDelete },
        });
        alert(response.data.message || "Task deleted successfully!");
        this.fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    },
  },
  async mounted() {
    // Fetch available adapters for the reference dropdown
    try {
      const response = await apiClient.get("/adapter");
      this.availableAdapters = response.data.map((adapter) => adapter.name);
    } catch (error) {
      console.error("Error fetching adapters:", error);
    }
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
  max-width: 900px;
  margin: 1rem;
  box-shadow: 0 0 20px rgba(108, 99, 255, 0.2);
}

.section {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 0.5rem;
  display: block;
}

.input-field {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  background: #2a2a54;
  color: #fff;
  font-size: 1rem;
}

.action-button {
  background: #6c63ff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
}

.action-button:hover {
  background: #5147d7;
}
</style>
