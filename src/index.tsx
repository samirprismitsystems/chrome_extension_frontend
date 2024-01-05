import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Box, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainPage from './components/MainPage/MainPage';
import './styles/global.scss';
import { theme } from "./styles/theme";
import Utils from './utils/utils';
require("react-toastify/dist/ReactToastify.css");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Auth0ProviderWithScopes = ({ children }: any) => {
  const { error } = useAuth0();

  if (error) {
    console.log(Utils.showErrorMessage(error.message));
  }


  // auth0 credentials should be changed for now this is used of samirshaikh.test.in@gmail.com
  return (
    <Auth0Provider
      domain="samirqureshi.us.auth0.com"
      clientId="GkxXTzA3mDH0ay3BDeqrAeIIqQXtcWza"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "this is identifier",
        scope: "openid profile email",
      }}
    >
      {children}
    </Auth0Provider>
  );
};



root.render(
  <>
    <Box sx={{
      position: "absolute",
      zIndex: "99999 !important"
    }}>
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={3000}
        pauseOnHover={true}
      />
    </Box>
    <ThemeProvider theme={theme}>
      <Auth0ProviderWithScopes>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Auth0ProviderWithScopes>
    </ThemeProvider>
  </>
);