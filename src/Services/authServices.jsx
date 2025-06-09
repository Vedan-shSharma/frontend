import { api } from '../config/api';

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login for email:', email);
    const res = await api.post("/auth/login", { email, password });
    console.log('Login response:', res.data);

    // Validate response data
    if (!res.data || !res.data.userId || !res.data.role) {
      console.error('Invalid login response data:', res.data);
      throw new Error('Invalid response from server');
    }

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(res.data));
    console.log('User data stored in localStorage');

    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.code === "ERR_NETWORK") {
      throw new Error("Unable to connect to the server. Please check if the server is running.");
    }
    if (error.code === "ERR_CERT_AUTHORITY_INVALID") {
      throw new Error("SSL certificate validation failed. This is normal in development. Please proceed.");
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    console.log('Attempting registration with data:', { ...data, password: '[REDACTED]' });
    const res = await api.post("/auth/register", data);
    console.log('Registration response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      throw error;
    } else if (error.request) {
      throw new Error("No response from server. Please try again.");
    } else {
      throw new Error("Error setting up the request. Please try again.");
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log('Requesting password reset for email:', email);
    const res = await api.post("/auth/forget-password", { email });
    console.log('Password reset request response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (email, token, newPassword) => {
  try {
    console.log('Attempting password reset for email:', email);
    const res = await api.post("/auth/reset-password", {
      email,
      token,
      newPassword,
    });
    console.log('Password reset response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Add a utility function to check if user is logged in
export const isLoggedIn = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return !!(user && user.userId && user.role);
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
