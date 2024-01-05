import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AuthGuard from "../../authGuard/AuthGuard";
import PageLoading from "../../common/PageLoading";
import { enums } from "../../enum";
import ApiServices from "../../services/ApiServices";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth0();

  const loadData = async () => {
    try {
      if (user) {
        setIsLoading(true)
        const result = await ApiServices.userLogin(user);
        if (result.isError) {
          Utils.setItem(enums.IS_LOGIN, false)
          throw new Error(result.message)
        }

        Utils.setItem(enums.IS_LOGIN, true)
      }
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false)
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
        const result = await ApiServices.aliExpressGenerateAccessTokenForNow(token);
        // Check if result is defined before storing in localStorage

        if (result && result.data && result.data.code == "IncompleteSignature") {
          Utils.showErrorMessage(result.data.message)
          return null;
        }

        if (result !== undefined) {
          Utils.setItem(enums.ALI_EXPRESS_TOKEN, result);
          // window.location.replace("/dashboard");
        } else {
          Utils.showErrorMessage("Token retrieval failed.");
        }
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

  if (isLoading) return <PageLoading />
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
