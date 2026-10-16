import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {

  async login(credentials) {
    try {
      
      const response = await axios.post(`${API_URL}/users`, credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 404) {
        throw new Error("Пользователь не найден или неверный пароль.");
      } else {
        throw new Error("Ошибка при попытке входа. Пожалуйста, попробуйте позже.");
      }
    }
  },

  async getPricing() {
    try {
      const response = await axios.get(`${API_URL}/pricing`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pricing:", error);
      throw error;
    }
  },

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

  async createFarm(farmData) {
    try {
      const response = await axios.post(`${API_URL}/farms`, farmData);
      return response.data; 
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  },

  async updateFarm(farmId, farmData) {
    try {
      const url = `${API_URL}/farms/${farmId}`;
      const response = await axios.put(url, farmData);

      //const response = await axios.put(`\({API_URL}/farms/\){farmId}`, farmData);
      return response.data; 
    } catch (error) {
      console.error(`Error updating farm with id ${farmId}:`, error);
      throw error;
    }
  },


  async deleteFarm(farmId) {
    try {
      await axios.delete(`\({API_URL}/farms/\)${farmId}`);
    } catch (error) {
      console.error(`Error deleting farm with id ${farmId}:`, error);
      throw error;
    }
  }
};