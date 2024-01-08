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

      const url = "https://api-sg.aliexpress.com/sync";
      const appKey = "503950"; // Replace with your actual client_id
      const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ"; // Replace with your actual client_secret

      const param: any = {
        app_key: appKey,
        code: token,
        format: "json",
        method: '/auth/token/create',
        sign_method: "sha256",
        timestamp: Math.floor(Date.now() / 1000),
      };

      // Sorting the object properties by key
      const sortedParameters = Object.fromEntries(Object.entries(param).sort());
      const parameters = Object.entries(sortedParameters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as any)}`)
        .join('&');


      const sign = parameters.replace(/&/g, "").replace(/=/g, "");
      const signString = appSecret + sign + appSecret;

      // Create SHA256 hash
      const encoder = new TextEncoder();
      const data = encoder.encode(signString);

      // const crypto = window.crypto; // Handle browser compatibility

      // const hashBuffer = await crypto.subtle.digest('sha256', data);
      // const hashArray = Array.from(new Uint8Array(hashBuffer));
      // const sha256Hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      // const finalSign = sha256Hash.toUpperCase();

      const finalSign = await axios.get(
        `https://prismcodehub.com/aliexpress?md5=${signString}`
      );

      // console.log(finalSign, " finalSign");

      // const md5Hash = crypto.createHash("md5").update(signString).digest("hex");
      // const finalSign = md5Hash.toUpperCase();


      const finalUrl = `https://api-sg.aliexpress.com/sync?${parameters}&sign=${finalSign.data}`;

      let config: any = {
        method: "post",
        maxBodyLength: Infinity,
        url: finalUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: param,
      };

      const a = axios
        .request(config)
        .then((response) => {
          return response.data;
        })
        .catch((error: any) => {
          Utils.showErrorMessage(error.message);
        });


      const result = a;
      console.log(result, "----------main Data");
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
      // window.location.reload();
    }
  };


  useEffect(() => {
    if (token && !Utils.getItem(enums.ALI_EXPRESS_TOKEN)) {
      getAccessToken(token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // adding comments

  if (isLoading) return <PageLoading />;
  return (
    <AuthGuard>
      <MenuAppBar>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A ratione quo
          repudiandae, eum qui necessitatibus omnis recusandae enim quibusdam
          nobis placeat accusamus vitae laudantium pariatur praesentium sunt
          quos corporis? Eos iure quasi debitis, voluptates ea, nulla illum ut
          quidem labore culpa accusamus tenetur aperiam facilis sed quia dolores
          velit! Fugiat, inventore vitae dolores illum consequatur tenetur nisi
          nostrum sunt at, ipsa asperiores architecto necessitatibus! Dolores
          dolore ratione dolorem natus iusto ullam velit. Saepe alias natus
          magni molestias rerum, fugit repudiandae necessitatibus iusto ut ipsam
          possimus at consequatur nesciunt tempora esse cum dolor similique
          ullam impedit dolore nam fuga, placeat excepturi? Amet esse asperiores
          totam alias vero illum ipsum accusantium, numquam nam obcaecati
          quaerat debitis odio, ullam quo officiis eius dolorem tenetur! Itaque
          soluta, sequi totam dignissimos tempora eos perferendis numquam
          repellat incidunt nobis iste id veniam quibusdam ipsam officia sed
          dolores quaerat ipsa fugiat quo, minus eveniet. Vero, animi
          perferendis?
        </Typography>
      </MenuAppBar>
    </AuthGuard>
  );
};

export default DashboardPage;
