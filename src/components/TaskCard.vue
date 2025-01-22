<template>
  <div class="management-card">
    <h2>Task Management</h2>

    <!-- Create Task -->
    <div class="section">
      <h3>Create Task</h3>
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
        <option
          v-for="adapter in availableAdapters"
          :key="adapter"
          :value="adapter"
        >
          {{ adapter }}
        </option>
      </select>
      <button @click="createTask" class="action-button">Create Task</button>
    </div>

    <!-- View Tasks -->
    <div class="section">
      <h3>View Tasks</h3>
      <button @click="fetchTasks" class="action-button">List Tasks</button>
      <table v-if="tasks.length" class="tasks-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Dataset</th>
            <th>Adapter</th>
            <th>State</th>
            <th>Download Adapter</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks" :key="index">
            <td>{{ task.name }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.dataset }}</td>
            <td>{{ task.adapter }}</td>
            <td>{{ task.state }}</td>
            <td>
              <button
                v-if="task.state === 'DONE'"
                @click="downloadAdapter(index)"
                class="download-button"
              >
                Download
              </button>
              <!-- Download Progress Bar -->
              <div v-if="task.isDownloading" class="progress-container" style="margin-top: 10px;">
                <div :id="'downloadProgressBar' + task.name" class="progress-bar" role="progressbar" :aria-valuenow="task.downloadProgress" aria-valuemin="0" aria-valuemax="100" :style="{ width: task.downloadProgress + '%' }">
                  <span>{{ task.downloadProgress }}%</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No tasks available.</p>
    </div>

    <!-- Delete Task -->
    <div class="section">
      <h3>Delete Task</h3>
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
      taskPollingInterval: null,
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
        const fetchedTasks = response.data.map(taskString => JSON.parse(taskString));

        // 使用 map 方法来返回修改后的任务数组
        this.tasks = fetchedTasks.map(task => {
          const existingTask = this.tasks.find(t => t.name == task.name);
          if (existingTask && existingTask.isDownloading === true) {
            console.log(existingTask.name);
            task.isDownloading = existingTask.isDownloading;
            task.downloadProgress = existingTask.downloadProgress;
          } else {
            task.isDownloading = false;
            task.downloadProgress = 0;
          }
          return task;  // 确保返回修改后的任务
        });

        console.log(this.tasks);
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
    startTaskPolling() {
      this.taskPollingInterval = setInterval(this.fetchTasks, 1000); // Poll every 5 seconds
    },
    stopTaskPolling() {
      if (this.taskPollingInterval) {
        clearInterval(this.taskPollingInterval);
        this.taskPollingInterval = null;
      }
    },

    async downloadAdapter(index) {
      this.tasks[index].isDownloading = true; // 开始下载，显示进度条
      this.tasks[index].downloadProgress = 0; // 初始化进度为 0

      try {
        const response = await apiClient.get(`/adapter/download_weight/${this.tasks[index].adapter}`, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              this.tasks[index].downloadProgress = progress; // 更新当前任务的进度
              console.log("更新当前任务的进度:"+this.tasks[index].downloadProgress);
            }
          }
        });

        const fileName = `adapter_model.bin`; 

        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);
        link.download = fileName;
        link.click();


        const response2 = await apiClient.get(`/adapter/download_config/${this.tasks[index].adapter}`, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              console.log("更新当前任务的进度:"+this.tasks[index].downloadProgress);
            }
          }
        });

        const fileName2 = `adapter_config.json`; 

        const link2 = document.createElement('a');
        link.href = URL.createObjectURL(response2.data);
        link.download = fileName2;
        link.click();
        
        // 下载完成后，隐藏进度条
        this.tasks[index].isDownloading = false;
        this.tasks[index].downloadProgress = 0;

      } catch (error) {
        console.error("Download failed:", error);
        alert("下载失败");
        this.tasks[index].isDownloading = false;
        this.tasks[index].downloadProgress = 0;
      }
    },
  },
  async mounted() {
    try {
      const response = await apiClient.get("/adapter");
      this.availableAdapters = response.data.map((adapter) => adapter.name);
    } catch (error) {
      console.error("Error fetching adapters:", error);
    }
    this.startTaskPolling();
  },
  beforeDestroy() {
    this.stopTaskPolling();
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

/* Styling for the table */
.tasks-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  background: #2a2a54;
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.tasks-table th,
.tasks-table td {
  padding: 0.75rem 1rem;
  text-align: center;
  border-bottom: 1px solid #444;
}

.tasks-table th {
  background: #333a56;
  font-weight: bold;
}

.tasks-table tr:hover {
  background: #444b6e;
}

.tasks-table tr:nth-child(even) {
  background: #2a2a54;
}

.tasks-table tbody tr:last-child td {
  border-bottom: none;
}

.tasks-table td {
  font-size: 0.9rem;
}

/* 下载按钮的样式 */
.download-button {
  display: inline-block;
  background-color: #6c63ff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  text-align: center;
  margin: 0 auto; /* 居中对齐按钮 */
  display: block; /* 使按钮块级显示，从而可以居中 */
}

.download-button:hover {
  background-color: #5147d7; /* 鼠标悬浮时改变背景颜色 */
  transform: scale(1.05); /* 鼠标悬浮时放大按钮 */
}

.download-button:active {
  background-color: #3e38b1; /* 鼠标点击时改变背景颜色 */
  transform: scale(0.98); /* 鼠标点击时按钮稍微缩小 */
}

/* Download Progress Bar */
.progress-container {
  width: 100%;
  background-color: #444;
  height: 20px;
  border-radius: 5px;
  position: relative;
}

.progress-bar {
  background-color: #6c63ff;
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
  position: relative; /* This ensures the span can be centered within the bar */
}

.progress-bar span {
  position: absolute;
  top: 50%;   /* Vertically center the text */
  left: 50%;  /* Horizontally center the text */
  transform: translate(-50%, -50%); /* Adjust for exact centering */
  color: white;
  font-size: 12px;
  text-align: center;
}
</style>
