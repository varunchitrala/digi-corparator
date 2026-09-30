import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || {
    user_id: 'u-corp-024',
    first_name: 'Anand',
    last_name: 'Patil',
    email: 'corporator.ward24@demomunicipal.gov.in',
    role_code: 'CORPORATOR',
    designation: 'Hon. Corporator (Ward 24)',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  },
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token') || true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tenantId', user.tenant_id);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Login failed';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
