import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Container, Typography } from "@mui/material";
import { enums } from "../../enum";
import Utils from "../../utils/utils";

const LoginPage = () => {
  const { getAccessTokenSilently, loginWithPopup } = useAuth0();


  const onLogin = async () => {
    try {
      await loginWithPopup();
      const tokenInfo = await getAccessTokenSilently();
      Utils.setItem(enums.AUTH0_TOKEN, tokenInfo)
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message)
    }
  };



  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100vh", flexDirection: "column", gap: "20px" }}>
        <Box>
          <img src="favicon.ico" alt="" />
        </Box>
        <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <Button sx={{
            width: "150px",
            marginTop: "1rem"
          }} onClick={async () => {
            await onLogin();
          }} color="primary" type="button" variant="contained">
            <Typography component="h1" variant="h5">
              Login
            </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
