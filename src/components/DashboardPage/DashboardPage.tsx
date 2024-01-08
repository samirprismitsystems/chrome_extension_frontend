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

  useEffect(() => {
    const loadData = async (token: string) => {
      try {
        setIsLoading(true);
        const url = "https://api-sg.aliexpress.com/sync";
        const appKey = "503950"; // Replace with your actual client_id
        const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ"; // Replace with your actual client_secret

        let param: any = {};
        param["app_key"] = appKey;
        param["code"] = token;
        param["format"] = "json";
        param["method"] = "/auth/token/create";
        param["sign_method"] = "md5";
        param["timestamp"] = Math.floor(Date.now() / 1000);

        // Sorting the object properties by key
        const sortedParameters: any = Object.fromEntries(
          Object.entries(param).sort()
        );

        let parameters = "";
        for (const [key, value] of Object.entries(sortedParameters)) {
          if (!parameters) {
            parameters = `${key}=${value}`;
          } else {
            parameters += `&${key}=${encodeURIComponent(value as any)}`;
          }
        }

        let sign = parameters.replace(/&/g, "").replace(/=/g, "");
        const signString = appSecret + sign + appSecret;
        const finalSign = await axios.get(
          `https://prismcodehub.com/aliexpress?md5=${signString}`
        );

        // console.log(finalSign, " finalSign");

        // const md5Hash = crypto.createHash("md5").update(signString).digest("hex");
        // const finalSign = md5Hash.toUpperCase();

        const finalUrl = `https://api-sg.aliexpress.com/sync?sign=${finalSign.data}`;

        // const result = await axios.post(finalUrl, new URLSearchParams(param), {
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        //   },
        // });

        // add comment

        const result = await axios.post(finalUrl, JSON.stringify(sortedParameters))


        console.log(result, "----------main Dtata");
      } catch (ex: any) {
        Utils.showErrorMessage(ex.message);
      } finally {
        setIsLoading(false);
        // window.location.reload();
      }
    };

    // Check if token is present and local storage does not have .ALI_EXPRESS_TOKEN
    if (token && !Utils.getItem(enums.ALI_EXPRESS_TOKEN)) {
      loadData(token);
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
