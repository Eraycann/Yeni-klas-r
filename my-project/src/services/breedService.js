import { fetchWithAuth } from './apiService';

const breedService = {
  // Tüm ırkları sayfalama ile getir
  async getBreeds(page = 0, size = 10) {
    return fetchWithAuth(`breeds?page=${page}&size=${size}`);
  },

  // Tek bir ırk detayını getir
  async getBreedById(id) {
    return fetchWithAuth(`breeds/${id}`);
  },

  // Yeni ırk ekle
  async createBreed(breedData) {
    return fetchWithAuth('breeds', {
      method: 'POST',
      body: JSON.stringify(breedData),
    });
  },

  // Irkı güncelle
  async updateBreed(id, breedData) {
    return fetchWithAuth(`breeds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(breedData),
    });
  },

  // Irkı sil
  async deleteBreed(id) {
    return fetchWithAuth(`breeds/${id}`, {
      method: 'DELETE',
    });
  },
};

export default breedService; 