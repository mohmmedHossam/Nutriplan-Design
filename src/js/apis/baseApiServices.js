import { apikey, baseUrl } from "/src/js/apis/apiRoutes.js";


export class BaseApiService {
  static async request(endpoint, method, body = null, options = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      return response.status !== 204 ? await response.json() : null;
    } catch (error) {
      console.error(`[${method}] Error:`, error.message);
      throw error;
    }
  }

  static get(endpoint, queryParams,options) {
    const query = new URLSearchParams(queryParams).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;

    return this.request(url, "GET", null, options);
  }

  static post(endpoint, body, ) {
    return this.request(endpoint, "POST", body, {
      headers: { 'x-api-key' : apikey },
    });
  }

  static put(endpoint, body, options) {
    return this.request(endpoint, "PUT", body, options);
  }

  static delete(endpoint, options) {
    return this.request(endpoint, "DELETE", null, options);
  }
}
  