import api from "../utils/axiosConfig";

class AuthService {
  // Store tokens
  setTokens(token, refreshToken) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  }

  // Get tokens
  getTokens() {
    return {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }

  // Clear tokens
  clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const { refreshToken } = this.getTokens();

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await api.post("/api/user/refresh", {
        refreshToken,
      });

      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data.token;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Login
  async login(email, password) {
    const response = await api.post("/api/user/login", {
      email,
      password,
    });

    if (response.data.success) {
      this.setTokens(response.data.token, response.data.refreshToken);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  }

  // Register
  async register(name, email, password) {
    const response = await api.post("/api/user/register", {
      name,
      email,
      password,
    });

    if (response.data.success) {
      this.setTokens(response.data.token, response.data.refreshToken);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  }

  // Logout
  async logout() {
    try {
      // Only call logout API if we have a token
      const { token } = this.getTokens();
      if (token) {
        await api.post("/api/user/logout");
      }
    } catch (error) {
      console.log("Logout API error:", error);
      // Don't throw error - we still want to clear local tokens
    } finally {
      this.clearTokens();
    }
  }
}

export default new AuthService();
