<template>
  <body>
    <div style="display: flex; justify-content: center;">
      <H2>Добро пожаловать на страницу заказа</H2>
      <div>
        <button @click="handleLogout" class="logout-btn">Выход</button>
      </div>
    </div>
    <div class="customer-page-container">
      <H2>Птицы в наличии</H2>
      <h3>Куры</h3>
        <div class="calculator">
        <label for="quantity">Введите нужное вам количество птиц:</label>
        <input type="number" id="quantity" v-model.number="ChickenCount" min="0">
      </div>
      <h3>Утки</h3>
        <div class="calculator">
        <label for="quantity">Введите нужное вам количество птиц:</label>
        <input type="number" id="quantity" v-model.number="DuckCount" min="0">
      </div>
      <h3>Гуси</h3>
        <div class="calculator">
        <label for="quantity">Введите нужное вам количество птиц:</label>
        <input type="number" id="quantity" v-model.number="GooseCount" min="0">
      </div>
      <button @click="calculatePrice">Рассчитать</button>

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
  </body>
</template>

<script>
import api from '../services/api';
import { logout } from '../router'; 

export default {
  name: 'CustomerPage',
  data() {
    return {
      ChickenCount: 0,
      DuckCount: 0,
      GooseCount: 0,
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
      if (!this.pricingLoaded || !this.ChickenCount && this.ChickenCount < 0 && !this.DuckCount && this.DuckCount < 0 && !this.GooseCount && this.GooseCount < 0) {
        this.error = 'Пожалуйста, введите корректное количество птиц.';
        this.totalPrice = null;
        return;
      }
      const pricePerChicken = this.pricing.chicken;
      const pricePerDuck = this.pricing.duck;
      const pricePerGoose = this.pricing.goose;
      this.totalPrice = this.ChickenCount * pricePerChicken + this.DuckCount * pricePerDuck + this.GooseCount * pricePerGoose;
    },
    handleLogout() {
      logout();
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