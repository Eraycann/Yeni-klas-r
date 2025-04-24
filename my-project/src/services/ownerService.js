import { fetchWithAuth } from './apiService';

const API_URL = 'http://localhost:8081/api';

const ownerService = {
  // Hasta sahiplerini sayfalama ile getir
  async getOwners(page = 0, size = 10) {
    return fetchWithAuth(`owners?page=${page}&size=${size}`);
  },

  // Hasta sahibi detayını getir
  async getOwnerById(id) {
    return fetchWithAuth(`owners/${id}`);
  },

  // Yeni hasta sahibi ekle
  async createOwner(ownerData) {
    return fetchWithAuth('owners', {
      method: 'POST',
      body: JSON.stringify(ownerData),
    });
  },

  // Hasta sahibini güncelle
  async updateOwner(id, ownerData) {
    return fetchWithAuth(`owners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ownerData),
    });
  },

  // Hasta sahibini sil
  async deleteOwner(id) {
    return fetchWithAuth(`owners/${id}`, {
      method: 'DELETE',
    });
  },
};

export default ownerService; 