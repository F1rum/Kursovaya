<template>
  <div class="customer-page-container">
    <div class="header">
      <h2>Калькулятор стоимости птиц</h2>
      <button @click="handleLogout" class="logout-btn">Выход</button>
    </div>
    <!-- ... остальной код компонента ... -->
     <div class="calculator">
      <label for="quantity">Количество птиц:</label>
      <input type="number" id="quantity" v-model.number="birdCount" min="1">
      <button @click="calculatePrice" :disabled="!birdCount || birdCount < 1">Рассчитать</button>
    </div>
    <div v-if="totalPrice !== null" class="result">
      <p>Общая стоимость: {{ totalPrice.toLocaleString('ru-RU') }} руб.</p>
    </div>
    <div v-if="!pricingLoaded && !error">
      <p>Загрузка цен...</p>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { logout } from '../router'; 

export default {
  name: 'CustomerPage',
  data() {
    return {
      birdCount: 1,
      totalPrice: null,
      pricing: {},
      pricingLoaded: false,
      error: ''
    };
  },
  async created() {
    await this.loadPricing();
  },
  methods: {
    async loadPricing() {
      try {
        const pricingData = await api.getPricing();
        this.pricing = pricingData;
        this.pricingLoaded = true;
      } catch (e) {
        this.error = 'Не удалось загрузить цены. Проверьте работу JSON Server.';
        console.error("Error loading pricing:", e);
      }
    },
    calculatePrice() {
      if (!this.pricingLoaded || !this.birdCount || this.birdCount < 1) {
        this.error = 'Пожалуйста, введите корректное количество птиц.';
        this.totalPrice = null;
        return;
      }
      const pricePerBird = this.pricing.chicken;
      if (pricePerBird === undefined) {
        this.error = 'Цена на курицу не установлена.';
        this.totalPrice = null;
        return;
      }
      this.totalPrice = this.birdCount * pricePerBird;
    },
    handleLogout() {
      logout(); // Вызываем функцию выхода
    }
  }
};
</script>

<style scoped>
.customer-page-container {
  font-family: sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 40px auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.header h2 {
  color: #333;
  margin: 0; 
}
.logout-btn {
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.logout-btn:hover {
  background-color: #d32f2f;
}

.calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}
label {
  font-size: 1.1em;
  color: #555;
}
input[type="number"] {
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.1em;
  width: 150px;
  text-align: center;
}
button { 
  padding: 12px 25px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover:not(:disabled) {
  background-color: #1976D2;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.result {
  margin-top: 20px;
  font-size: 1.3em;
  font-weight: bold;
  color: #388E3C;
}
.error-message {
  color: #f44336;
  margin-top: 15px;
}
</style>