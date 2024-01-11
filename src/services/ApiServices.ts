import axios from "axios";
import { BACKEND_URI } from "../config";
import { enums } from "../enum";
import Utils from "../utils/utils";

interface IResponse {
  data: any;
  isError: boolean;
  message: string;
}

const headerContent = () => {
  return {
    headers: {
      Authorization: `Bearer, ${Utils.getItem(enums.AUTH0_TOKEN)}`,
    },
  };
};

class ApiServices {
  static userLogin = async (user: any): Promise<IResponse> => {
    const url = `${BACKEND_URI}/auth/login`;
    const res = await axios.post(
      url,
      {
        userInfo: user,
      },
      headerContent()
    );
    return res.data;
  };

  static saveSettings = async (io: any): Promise<IResponse> => {
    const url = `${BACKEND_URI}/setting/save`;
    const res = await axios.post(url, io, headerContent());
    return res.data;
  };

  static getSettings = async (settingID?: string): Promise<IResponse> => {
    const url = `${BACKEND_URI}/setting?settingID=${settingID}`;
    const res = await axios.get(url, headerContent());

    return res.data;
  };

  static getSallaProducts = async (): Promise<any> => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.salla.dev/admin/v2/products",
      headers: {
        Authorization: `Bearer ${Utils.getSallaToken()}`,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        return JSON.stringify(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  static getSallLoginScreen = async (): Promise<any> => {
    try {
      window.location.replace(
        "https://accounts.salla.sa/oauth2/auth?client_id=31f652a5-7736-4ba9-990e-f9243f8685fa&response_type=code&redirect_uri=https://chrome-extension-frontend.vercel.app/settings&scope=offline_access&state=12345678"
      );
    } catch (error) {
      // Handle errors
      throw error;
    }
  };

  static sallaAuthorization = async (settingID?: string): Promise<any> => {
    try {
      const url = `${BACKEND_URI}/auth/salla_account/authorize?settingID=${settingID}`;
      const res = await axios.get(url, headerContent());

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  static getSallaAccountToken = async (token: string): Promise<any> => {
    try {
      let data = {
        client_id: "31f652a5-7736-4ba9-990e-f9243f8685fa",
        client_secret: "af8853f2912da6fd17d2bf05174525f7",
        grant_type: "authorization_code",
        code: token,
        scope: "offline_access",
        redirect_uri: "https://chrome-extension-frontend.vercel.app/settings",
      };

      let config: any = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://accounts.salla.sa/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
      };

      return axios
        .request(config)
        .then((response) => {
          return response.data;
        })
        .catch((error: any) => {
          Utils.showErrorMessage(error.message);
        });
    } catch (error: any) {
      Utils.showErrorMessage(error.message);
    }
  };

  static getSallaOrders = async (): Promise<any> => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.salla.dev/admin/v2/orders",
      headers: {
        Authorization: `Bearer ${Utils.getSallaToken()}`,
      },
    };

    return axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response.data.error.code;
      });
  };

  static aliExpressAuthorization = async (settingID?: string): Promise<any> => {
    try {
      const url = `${BACKEND_URI}/auth/aliexpress/authorize?settingID=${settingID}`;
      const res = await axios.get(url, headerContent());

      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  static sallaAccountAuthorization = async (
    settingID?: string
  ): Promise<any> => {
    try {
      const url = `${BACKEND_URI}/auth/salla_account/authorize?settingID=${settingID}`;
      const res = await axios.get(url, headerContent());

      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  // its not usefull its just create for test purpose
  static aliExpressGenerateAccessTokenForNow = async (
    token: string
  ): Promise<any> => {
    try {
      const url = `${BACKEND_URI}/auth/getToken?code=${token}`;
      const res = await axios.get(url, headerContent());

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  static getAliExpressFeedList = async (mainURI: string): Promise<any> => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: mainURI,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };

    return axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response.data.error.code;
      });
  };
  
  static getAliExpressProducts = async (mainURI: string): Promise<any> => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: mainURI,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };

    return axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response.data.error.code;
      });
  };
}

export default ApiServices;
