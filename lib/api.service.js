import { backUrl } from "../lib/utils.js";
import axios from "axios";

export const ApiService = {
  async getData(url) {
    try {
      const fullUrl = `${backUrl}${url}`;
      const response = await axios.get(fullUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  },
};
