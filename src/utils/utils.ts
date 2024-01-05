import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { enums } from "../enum";

class Utils {
  static setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key: string) {
    const info = JSON.parse(localStorage.getItem(key) || "{}");

    if (typeof info === "object" && Object.keys(info).length <= 0) {
      return null;
    }

    return info;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static getUserInfo() {
    const userInfo = this.getItem(enums.USER_INFO);
    if (!userInfo) return null;
    return userInfo;
  }

  static setUserInfo(userInfo: any) {
    this.setItem(enums.USER_INFO, userInfo);
  }

  static isUserLoggedIn() {
    const isLogin = this.getItem(enums.IS_LOGIN);
    return isLogin;
  }

  static clearStorage() {
    localStorage.clear();
  }

  static getSallaToken() {
    const token = this.getItem(enums.SALLA_TOKEN);
    if (token) {
      return token.access_token;
    }

    return false;
  }

  static showErrorMessage(message: string) {
    toast.error(message, {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  static showSuccessMessage(message: string) {
    toast.success(message, {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  static async showWarningMessage(message: string) {
    return await Swal.fire({
      title: message,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    });
  }

  static getContent(data: any) {
    if (data) return data;
    return "N/A";
  }

  static formatCurrency(amount: number, currencyCode: string) {
    if (typeof amount !== "number") {
      return "Invalid amount";
    }

    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: currencyCode,
    });
  }
}

export default Utils;
