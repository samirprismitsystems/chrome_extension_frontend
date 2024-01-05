import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Utils from "../utils/utils";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const containerStyle: any = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
  };

  const headingStyle = {
    marginBottom: "20px",
    color: "#3f51b5",
  };

  const buttonStyle = {
    marginTop: "20px",
    backgroundColor: "#3f51b5",
    color: "#fff",
  };

  

  return (
    <div style={containerStyle}>
      <Typography variant="h4" style={headingStyle}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for might be in another galaxy.
      </Typography>
      <Button
        onClick={() => {
          if (Utils.isUserLoggedIn()) {
            window.history.back();
          } else {
            navigate("/login");
          }
        }}
        variant="contained"
        style={buttonStyle}
      >
        Go Back
      </Button>
    </div>
  );
};

export default PageNotFound;
