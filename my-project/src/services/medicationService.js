import { fetchWithAuth } from './apiService';

const medicationService = {
  // Tüm ilaçları getir
  async getMedications(page = 0, size = 10) {
    return fetchWithAuth(`medication/all?page=${page}&size=${size}`);
  },

  // Tek bir ilaç detayını getir
  async getMedicationById(id) {
    return fetchWithAuth(`medication/find/${id}`);
  },

  // Yeni ilaç ekle
  async createMedication(medicationData) {
    return fetchWithAuth('medication/create', {
      method: 'POST',
      body: JSON.stringify(medicationData),
    });
  },

  // İlaçı güncelle
  async updateMedication(id, medicationData) {
    return fetchWithAuth(`medication/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicationData),
    });
  },

  // İlacı sil
  async deleteMedication(id) {
    return fetchWithAuth(`medication/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

export default medicationService; 