<template>
  <div class="login-container">
    <h2>Вход в систему</h2>
    <p>Добро пожаловать, авторизуйтесь для продолжения работы</p>
    <div class="login-form">
      <input type="text" v-model="username" placeholder="Имя пользователя (manager / customer)">
      <input type="password" v-model="password" placeholder="Пароль (password)">
      <button @click="login" :disabled="!username || !password">Войти</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      this.error = ''; 
      try {
        const users = await api.getUsers();
        const user = users.find(u => u.username === this.username && u.password === this.password);

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          if (user.role === 'manager') {
            this.$router.push('/manager');
          } else {
            this.$router.push('/customer');
          }
        } else {
          this.error = 'Неверное имя пользователя или пароль';
        }
      } catch (e) {
        this.error = 'Ошибка при попытке входа. Проверьте, запущен ли JSON Server.';
        console.error("Login error:", e);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  font-family: sans-serif;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
button {
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover:not(:disabled) {
  background-color: #45a049;
}
button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 10px;
}
</style>