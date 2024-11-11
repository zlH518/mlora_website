<template>
  <div class="dataset-settings-card">
    <h2>Data Set Settings</h2>
    <div class="settings-container">
      <!-- Row 1: Dataset Name and External Dataset Config -->
      <div class="setting-row">
        <div class="setting">
          <label>Data set name (--dataset)</label>
          <p>Select the dataset for training and support selection</p>
          <select class="input-field">
            <option value="default" disabled>Select Dataset</option>
            <option value="dataset1">Dataset 1</option>
            <option value="dataset2">Dataset 2</option>
            <!-- Add more dataset options here -->
          </select>
        </div>
        <div class="setting">
          <label>External data set configuration (--custom_dataset_info)</label>
          <p>Register the configuration file of the external dataset</p>
          <input type="text" placeholder="Configuration file path" class="input-field" />
        </div>
      </div>

      <!-- Row 2: Split Ratio, Max Length, Training Samples, Validation Samples -->
      <div class="setting-row">
        <div class="setting">
          <label>Verify the split ratio of the set (--dataset_test_ratio)</label>
          <p>Defines how much total data is split into the verification set.</p>
          <input type="number" class="input-number" value="0.01" step="0.01" min="0" max="1" />
          <input type="range" min="0" max="1" step="0.01" value="0.01" class="slider" />
        </div>
        <div class="setting">
          <label>The maximum length of the sentence (--max_length)</label>
          <p>Set the maximum length of the input model</p>
          <input type="number" class="input-number" value="9443" min="1" />
          <input type="range" min="1" max="10000" step="1" value="9443" class="slider" />
        </div>
        <div class="setting">
          <label>The number of training set samples (--train_dataset_sample)</label>
          <p>Specify the number of lines from the training set for training</p>
          <input type="number" class="input-number" placeholder="-1" />
        </div>
        <div class="setting">
          <label>Verify the number of samples in the set (--val_dataset_sample)</label>
          <p>Specify the number of rows from the verification set for training</p>
          <input type="number" class="input-number" placeholder="-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DatasetSettings',
})
</script>

<style scoped>
.dataset-settings-card {
  background: linear-gradient(145deg, #1b1f3a, #111324);
  border-radius: 15px;
  padding: 1.5rem;
  width: 100%;
  color: #ffffff;
  box-shadow: 0 0 30px rgba(108, 99, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dataset-settings-card h2 {
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
}

.setting p {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.input-field,
.input-number {
  background-color: #2a2f3b;
  border: none;
  border-radius: 5px;
  padding: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.slider {
  width: 100%;
  height: 4px;
  background-color: #413ca8;
  outline: none;
  appearance: none;
  margin-top: 0.3rem;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: #6c63ff;
  border-radius: 50%;
  cursor: pointer;
}
</style>
