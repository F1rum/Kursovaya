import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  // --- Пользователи ---
  async getUsers() {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // --- Фермы ---
  async getFarms() {
    try {
      const response = await axios.get(`${API_URL}/farms`);
      return response.data;
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  },
  async getFarm(id) {
    try {
      const response = await axios.get(`\({API_URL}/farms/\){id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm with id ${id}:`, error);
      throw error;
    }
  },

  // --- Цены (для покупателя) ---
  async getPricing() {
    try {
      const response = await axios.get(`${API_URL}/pricing`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pricing:", error);
      throw error;
    }
  }
};