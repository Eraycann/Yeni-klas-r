import { fetchWithAuth } from './apiService';

const bloodTypeService = {
  // Tüm kan gruplarını sayfalama ile getir
  async getBloodTypes(page = 0, size = 10) {
    return fetchWithAuth(`bloodTypes?page=${page}&size=${size}`);
  },

  // Tek bir kan grubu detayını getir
  async getBloodTypeById(id) {
    return fetchWithAuth(`bloodTypes/${id}`);
  },

  // Yeni kan grubu ekle
  async createBloodType(bloodTypeData) {
    return fetchWithAuth('bloodTypes', {
      method: 'POST',
      body: JSON.stringify(bloodTypeData),
    });
  },

  // Kan grubunu güncelle
  async updateBloodType(id, bloodTypeData) {
    return fetchWithAuth(`bloodTypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bloodTypeData),
    });
  },

  // Kan grubunu sil
  async deleteBloodType(id) {
    return fetchWithAuth(`bloodTypes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default bloodTypeService; 