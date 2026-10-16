<template>
  <div class="manager-dashboard-container">
    <div class="header">
      <h2>Панель управления менеджера</h2>
      <button @click="handleLogout" class="logout-btn">Выход</button>
    </div>

    <button @click="openAddFarmModal" class="add-farm-btn">Добавить новую ферму</button>

    <div v-if="loading">
      <p>Загрузка данных о фермах...</p>
    </div>
    <div v-else-if="farms.length === 0 && !error">
      <p>На данный момент нет ни одной фермы. Добавьте первую!</p>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- Отображение каждой фермы -->
    <div v-for="farm in farms" :key="farm.id" class="farm-card">
      <h3>{{ farm.name }}</h3>
      <div class="farm-info">
        <h4>Информация о птицах:</h4>
        <p v-if="farm.birds.length === 0">На этой ферме пока нет птиц.</p>
        <table v-else>
          <thead>
            <tr>
              <th>Вид птицы</th>
              <th>Количество</th>
              <th>Норма корма (кг/птицу)</th>
              <th>Стоимость 1 кг корма (руб.)</th>
              <th>Общий расход корма (кг)</th>
            </tr>
          </thead>
          <tbody>
            <!-- Список птиц на ферме -->
            <tr v-for="(bird, index) in farm.birds" :key="index">
              <td>{{ bird.type }}</td>
              <td>{{ bird.count }}</td>
              <td>{{ bird.feed_norm_kg }}</td>
              <td>{{ bird.price_per_kg_feed }}</td>
              <td>{{ calculateTotalFeed(bird) }}</td>
            </tr>
            <!-- Итоговая строка -->
            <tr class="farm-total">
              <td colspan="4"><strong>Всего на ферме</strong></td>
              <td><strong>{{ calculateFarmTotalFeed(farm) }}</strong></td>
            </tr>
          </tbody>
        </table>
        <button @click="openAddBirdModal(farm)" class="add-bird-btn">Добавить птицу на ферму</button>
      </div>
    </div>

    <!-- Модальное окно для добавления новой фермы -->
    <div v-if="isAddFarmModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>Добавление новой фермы</h3>
        <input type="text" v-model="newFarmName" placeholder="Название новой фермы">
        <div class="modal-buttons">
          <button @click="addFarm" :disabled="!newFarmName.trim()">Сохранить</button>
          <button @click="closeAddFarmModal">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления птицы -->
    <div v-if="isAddBirdModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>Добавление птицы на ферму "{{ currentFarmForBird?.name }}"</h3>
        <input type="text" v-model="newBird.type" placeholder="Вид птицы">
        <input type="number" v-model.number="newBird.count" placeholder="Количество">
        <input type="number" v-model.number="newBird.feed_norm_kg" placeholder="Норма корма (кг/птицу)">
        <input type="number" v-model.number="newBird.price_per_kg_feed" placeholder="Стоимость 1кг корма (руб.)">
        <div class="modal-buttons">
          <button @click="addBirdToFarm" :disabled="!(
            this.newBird.type.trim() !== '' && 
            this.newBird.count !== null && this.newBird.count > 0 && 
            this.newBird.feed_norm_kg !== null && this.newBird.feed_norm_kg >= 0 && 
            this.newBird.price_per_kg_feed !== null && this.newBird.price_per_kg_feed >= 0 
            )">
            Добавить</button>
          <button @click="closeAddBirdModal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { logout } from '../router'; 

export default {
  name: 'ManagerDashboard',
  data() {
    return {
      farms: [], 
      loading: false, 
      error: '', 

      isAddFarmModalVisible: false,
      newFarmName: '',

      isAddBirdModalVisible: false,
      currentFarmForBird: null, 
      newBird: { 
        type: '',
        count: null,
        feed_norm_kg: null,
        price_per_kg_feed: null
      }
    };
  },
  async created() {

    await this.fetchFarms();
  },
  methods: {
    async fetchFarms() {
      this.loading = true;
      this.error = '';
      try {
        this.farms = await api.getFarms();
      } catch (e) {
        this.error = 'Не удалось загрузить данные о фермах. Проверьте работу JSON Server.';
        console.error("Error fetching farms:", e);
      } finally {
        this.loading = false;
      }
    },

    handleLogout() {
      logout(); 
    },

    calculateTotalFeed(bird) {
      if (bird.count === undefined || bird.feed_norm_kg === undefined) return 'N/A';
      const totalFeed = bird.count * bird.feed_norm_kg;
      return totalFeed.toFixed(2);
    },

    calculateFarmTotalFeed(farm) {
      if (!farm.birds || farm.birds.length === 0) return '0.00';
      let total = 0;
      farm.birds.forEach(bird => {
        total += parseFloat(this.calculateTotalFeed(bird));
      });
      return total.toFixed(2);
    },

    openAddFarmModal() {
      this.newFarmName = '';
      this.isAddFarmModalVisible = true;
    },

    closeAddFarmModal() {
      this.isAddFarmModalVisible = false;
    },

    async addFarm() {
      if (!this.newFarmName.trim()) {
        alert("Пожалуйста, введите название фермы.");
        return;
      }
      const newFarmData = {
        name: this.newFarmName.trim(),
        birds: []
      };

      try {
        const createdFarm = await api.createFarm(newFarmData);
        this.farms.push(createdFarm);
        alert(`Ферма "${createdFarm.name}" успешно добавлена.`);
        this.closeAddFarmModal();
      } catch (e) {
        this.error = 'Не удалось добавить ферму. Проверьте работу JSON Server.';
        console.error("Error adding farm:", e);
        alert("Ошибка при добавлении фермы.");
      }
    },
    openAddBirdModal(farm) {
      this.currentFarmForBird = farm; 
      this.newBird = {
        type: '',
        count: null,
        feed_norm_kg: null,
        price_per_kg_feed: null
      };
      this.isAddBirdModalVisible = true;
    },

    closeAddBirdModal() {
      this.isAddBirdModalVisible = false;
      this.currentFarmForBird = null; 
    },
    async addBirdToFarm() {
      

      if (this.currentFarmForBird) {
        try {
          const birdToAdd = {
            type: this.newBird.type.trim(),
            count: this.newBird.count,
            feed_norm_kg: this.newBird.feed_norm_kg,
            price_per_kg_feed: this.newBird.price_per_kg_feed
          };
          const updatedBirdsList = [...this.currentFarmForBird.birds, birdToAdd];

          const updatedFarmData = {
            ...this.currentFarmForBird, 
            birds: updatedBirdsList      
          };

          const updatedFarm = await api.updateFarm(this.currentFarmForBird.id, updatedFarmData);

          const farmIndex = this.farms.findIndex(f => f.id === this.currentFarmForBird.id);
          if (farmIndex !== -1) {
            this.farms[farmIndex] = updatedFarm; 
          }

          alert(`Птица "\({birdToAdd.type}" успешно добавлена на ферму "\){updatedFarm.name}".`);
          this.closeAddBirdModal(); 

        } catch (e) {
          this.error = 'Не удалось добавить птицу. Проверьте работу JSON Server.';
          console.error("Error adding bird to farm:", e);
          alert("Ошибка при добавлении птицы. Пожалуйста, попробуйте снова.");
        }
      }
    }
  }
};
</script>

<style scoped>
.manager-dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 25px;
  max-width: 1200px;
  margin: 30px auto;
  background-color: #f4f7f6;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 2.2em;
}

.logout-btn {
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

.add-farm-btn, .add-bird-btn {
  display: inline-block;
  margin: 10px auto 30px auto;
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.add-farm-btn:hover, .add-bird-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}
.add-bird-btn {
  margin-top: 15px;
  background-color: #4CAF50;
}
.add-bird-btn:hover {
  background-color: #45a049;
}

.farm-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  padding: 25px;
  transition: box-shadow 0.3s ease;
}
.farm-card:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}
.farm-card h3 {
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}
.farm-info h4 {
  color: #34495e;
  font-size: 1.3em;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
th, td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
  font-size: 1em;
}
th {
  background-color: #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
}
td {
  color: #34495e;
}
.farm-total td {
  font-weight: bold;
  background-color: #f9f9f9;
  color: #2c3e50;
}

.loading-message, .error-message {
  text-align: center;
  font-size: 1.1em;
  color: #7f8c8d;
  margin-top: 20px;
}
.error-message {
  color: #e74c3c;
}

/* Модальное окно стили */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  text-align: center;
}
.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 20px;
}
.modal-content input[type="text"],
.modal-content input[type="number"] {
  width: calc(100% - 20px);
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1.1em;
  box-sizing: border-box;
}
.modal-buttons {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin-top: 25px;
}
.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}
.modal-buttons button:first-child { /* Сохранить/Добавить */
  background-color: #3498db;
  color: white;
}
.modal-buttons button:first-child:hover:not(:disabled) {
  background-color: #2980b9;
}
.modal-buttons button:last-child { /* Отмена */
  background-color: #e74c3c;
  color: white;
}
.modal-buttons button:last-child:hover {
  background-color: #c0392b;
}
.modal-buttons button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>