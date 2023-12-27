import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('user-token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export default {
  getTasks() {
    return apiClient.get('/tasks');
  },
  getTask(id) {
    return apiClient.get('/tasks/' + id);
  },
  postTask(task) {
    return apiClient.post('/tasks', {
      ...task,
      priority: task.priority || 'Low'
    });
  },
  updateTask(id, task) {
    return apiClient.put('/tasks/' + id, task);
  },
  deleteTask(id) {
    return apiClient.delete('/tasks/' + id);
  },
  updateTaskStatus(id, status) {
    return apiClient.patch('/tasks/' + id + '/completed', status);
  },
  updateTaskPriority(id, priority) {
    return apiClient.patch('/tasks/' + id + '/priority', { priority });
  }
};
