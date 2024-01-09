import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import axios from "axios";
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

  const getAccessToken = async (token: string) => {
    try {
      setIsLoading(true);
      const apiUrl = "https://api-sg.aliexpress.com/sync";
      const appKey = "503950";
      const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";

      const param = {
        app_key: appKey,
        code: token,
        format: "json",
        method: '/auth/token/create',
        sign_method: "sha256",
        timestamp: Date.now(),
      };

      const sortedParameters = Object.fromEntries(Object.entries(param).sort());
      const parameters = Object.entries(sortedParameters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const signString = Object.keys(sortedParameters)
        .map(key => `${key}${sortedParameters[key]}`)
        .join('');

      // const finalSign = await axios.get(
      //   `https://prismcodehub.com/aliexpress?md5=${signString}`
      // );

      const finalUrl = `${apiUrl}?${parameters}&sign=${signString}`;

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: finalUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: param,
      };

      await axios.request(config);
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !Utils.getItem(enums.ALI_EXPRESS_TOKEN)) {
      getAccessToken(token);
    }
  }, [token]);


  // adding comments

  if (isLoading) return <PageLoading />;
  return (
    <AuthGuard>
      <MenuAppBar>
        <Typography variant="body1">
          <h2>Main Dashboard</h2>
        </Typography>
      </MenuAppBar>
    </AuthGuard>
  );
};

export default DashboardPage;
