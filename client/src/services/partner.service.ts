import { apiClient } from '../lib/api-client';

export interface Partner {
  id: number;
  partnerCode: string;
  name: string;
  isCustomer: boolean;
  isSupplier: boolean;
  address: string;
  taxCode: string;
  phone: string;
}

export const partnerService = {
  getCustomers: async (): Promise<Partner[]> => {
    const res = await apiClient.get('/partners/customers');
    return res.data.result;
  },

  createCustomer: async (partner: Partial<Partner>): Promise<Partner> => {
    const res = await apiClient.post('/partners/customers', partner);
    return res.data.result;
  },

  updateCustomer: async (id: number, partner: Partial<Partner>): Promise<Partner> => {
    const res = await apiClient.put(`/partners/customers/${id}`, partner);
    return res.data.result;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await apiClient.delete(`/partners/customers/${id}`);
  },

  getSuppliers: async (): Promise<Partner[]> => {
    const res = await apiClient.get('/partners/suppliers');
    return res.data.result;
  },

  createSupplier: async (partner: Partial<Partner>): Promise<Partner> => {
    const res = await apiClient.post('/partners/suppliers', partner);
    return res.data.result;
  },

  updateSupplier: async (id: number, partner: Partial<Partner>): Promise<Partner> => {
    const res = await apiClient.put(`/partners/suppliers/${id}`, partner);
    return res.data.result;
  },

  deleteSupplier: async (id: number): Promise<void> => {
    await apiClient.delete(`/partners/suppliers/${id}`);
  },
};
