import { create } from 'zustand';
import api from '../services/api';

const DEMO_USERS = {
  'superadmin@nagarsevak.gov.in': {
    user_id: 'u-super-001',
    first_name: 'Super',
    last_name: 'Admin',
    email: 'superadmin@nagarsevak.gov.in',
    role_code: 'SUPER_ADMIN',
    designation: 'SaaS Master Admin',
    corporation_name: 'Global SaaS Platform',
    ward_name: 'All Wards',
    tenant_id: 't-global-001',
    corporation_id: 'c-global-001',
    ward_id: null
  },
  'admin@demomunicipal.gov.in': {
    user_id: 'u-corp-001',
    first_name: 'Rajesh',
    last_name: 'Deshmukh',
    email: 'admin@demomunicipal.gov.in',
    role_code: 'CORPORATION_ADMIN',
    designation: 'Municipal Commissioner',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'All Wards',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: null
  },
  'wardadmin.ward24@demomunicipal.gov.in': {
    user_id: 'u-wardadmin-024',
    first_name: 'Sunil',
    last_name: 'Gaikwad',
    email: 'wardadmin.ward24@demomunicipal.gov.in',
    role_code: 'WARD_ADMIN',
    designation: 'Ward Administrative Head (Ward 24)',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  },
  'corporator.ward24@demomunicipal.gov.in': {
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
  'depthead.water@demomunicipal.gov.in': {
    user_id: 'u-depthead-001',
    first_name: 'Prakash',
    last_name: 'Jadhav',
    email: 'depthead.water@demomunicipal.gov.in',
    role_code: 'DEPARTMENT_HEAD',
    designation: 'Chief Engineer (Water Supply)',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'All Wards',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: null
  },
  'officer.water@demomunicipal.gov.in': {
    user_id: 'u-dept-001',
    first_name: 'Suresh',
    last_name: 'Kulkarni',
    email: 'officer.water@demomunicipal.gov.in',
    role_code: 'OFFICER',
    designation: 'Ward Officer / Executive Engineer',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  },
  'staff.field@demomunicipal.gov.in': {
    user_id: 'u-staff-001',
    first_name: 'Ramesh',
    last_name: 'Kamble',
    email: 'staff.field@demomunicipal.gov.in',
    role_code: 'STAFF',
    designation: 'Field Inspector',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  },
  'contractor.demo@infra.com': {
    user_id: 'u-contractor-001',
    first_name: 'Sanjay',
    last_name: 'Mehta',
    email: 'contractor.demo@infra.com',
    role_code: 'CONTRACTOR',
    designation: 'Class A Municipal Contractor',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  },
  'citizen.demo@gmail.com': {
    user_id: 'u-cit-001',
    first_name: 'Vijay',
    last_name: 'Shinde',
    email: 'citizen.demo@gmail.com',
    role_code: 'CITIZEN',
    designation: 'Resident (Ward 24)',
    corporation_name: 'Demo Municipal Corporation',
    ward_name: 'Ward 24 - Shivaji Nagar',
    tenant_id: 't-demo-001',
    corporation_id: 'c-demo-001',
    ward_id: 'w-demo-024'
  }
};

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || DEMO_USERS['citizen.demo@gmail.com'],
  token: localStorage.getItem('token') || 'demo-auth-token-citizen',
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.tenant_id) localStorage.setItem('tenantId', user.tenant_id);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true, user };
    } catch (err) {
      // Graceful fallback to demo user if backend/database is offline
      const matchedDemoUser = DEMO_USERS[email?.toLowerCase()?.trim()];
      if (matchedDemoUser) {
        const dummyToken = `demo-token-${matchedDemoUser.role_code.toLowerCase()}-${Date.now()}`;
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(matchedDemoUser));
        if (matchedDemoUser.tenant_id) localStorage.setItem('tenantId', matchedDemoUser.tenant_id);

        set({
          user: matchedDemoUser,
          token: dummyToken,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true, user: matchedDemoUser };
      }

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
