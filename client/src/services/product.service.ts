import { apiClient } from '../lib/api-client';

export interface Product {
  id?: number;
  skuCode: string;
  name: string;
  unit: string;
  properties: string;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await apiClient.get('/products');
    return res.data.result;
  },

  createProduct: async (product: Product): Promise<Product> => {
    const res = await apiClient.post('/products', product);
    return res.data.result;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  getUnits: async (): Promise<string[]> => {
    const res = await apiClient.get('/products/units');
    return res.data.result;
  },
};
