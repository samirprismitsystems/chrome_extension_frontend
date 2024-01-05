import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
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
                Oops! You are not verified
            </Typography>
            <Typography variant="body1">
                please kindly login to your account or sighup.
            </Typography>
            <Button
                onClick={() => {
                    if (isAuthenticated) {
                        window.history.back();
                    } else {
                        navigate("/login");
                    }
                }}
                variant="contained"
                style={buttonStyle}
            >
                Go back
            </Button>
        </div>
    );
};

export default NotLoggedIn;
