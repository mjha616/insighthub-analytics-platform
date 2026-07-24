import axiosClient from './axiosClient';

export const authApi = {
  login: async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.success && res.data.token) {
      localStorage.setItem('access_token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },
  
  register: async (email, password, firstName, lastName) => {
    return await axiosClient.post('/auth/register', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
  },

  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    if (res.success) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res;
  },

  updateMe: async (data) => {
    const res = await axiosClient.put('/auth/me', {
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password || undefined,
    });
    if (res.success) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res;
  },

  deleteMe: async () => {
    const res = await axiosClient.delete('/auth/me');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return res;
  }
};
