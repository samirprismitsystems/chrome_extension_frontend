import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import axios from "axios";
import md5 from "md5";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import PageLoading from "../../common/PageLoading";
import { enums } from "../../enum";
import ApiServices from "../../services/ApiServices";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";

// add comment
const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth0();

  const loadData = async () => {
    try {
      if (user) {
        setIsLoading(true);
        const result = await ApiServices.userLogin(user);
        if (result.isError) {
          Utils.setItem(enums.IS_LOGIN, false);
          throw new Error(result.message);
        }

        Utils.setItem(enums.IS_LOGIN, true);
      }
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!Utils.isUserLoggedIn() && Utils.getItem(enums.AUTH0_TOKEN)) {
      loadData();
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const url = new URL(window.location.href);
  const token = url.searchParams.get("code");

  const generateAccessToken = async (token: string) => {
    try {
      setIsLoading(true);
      const mainURI = "https://api-sg.aliexpress.com/sync";
      const appKey = "503950";
      const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";

      let param: any = {};
      param["app_key"] = appKey;
      param["code"] = token;
      param["format"] = "json";
      param["method"] = "/auth/token/create";
      param["sign_method"] = "md5";
      param["timestamp"] = Date.now();

      const sortedParameters: any = Object.fromEntries(
        Object.entries(param).sort()
      );

      const parameters = Object.entries(sortedParameters).map(([key, value]) => {
        return `${key}=${value as any}`;
      }).join('&');

      let sign = parameters.replace(/&/g, "").replace(/=/g, "");
      const signString = appSecret + sign + appSecret;

      const md5Hash = md5(signString).toUpperCase();
      const finalSign = md5Hash.toUpperCase();
      const finalUrl = `${mainURI}?${parameters}&sign=${finalSign}`;

      await axios.get(finalUrl, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((result: any) => {
        Utils.setItem(enums.ALI_EXPRESS_TOKEN, result.data)
      }).catch((error) => {
        Utils.showErrorMessage(error.message)
      }).finally(() => {
        window.close();
      });
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !Utils.getItem(enums.ALI_EXPRESS_TOKEN)) {
      generateAccessToken(token);
    }
  }, [token]);


  // adding comments

  if (isLoading) return <PageLoading />;
  return (
    <AuthGuard>
      <MenuAppBar>
        <Typography variant="body1">
          Main Dashboard
        </Typography>
      </MenuAppBar>
    </AuthGuard>
  );
};

export default DashboardPage;
