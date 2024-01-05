import MenuIcon from '@mui/icons-material/Menu';
import { Hidden, useMediaQuery, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';
import SidePanel from '../SidePanel/SidePanel';
import UserProfile from './UserProfile';

export default function MenuAppBar({ children }: any) {
    const [isOpen, setIsOpen] = useState(true);

    const theme = useTheme();
    const isTrue = useMediaQuery(theme.breakpoints.up('md'));

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (isTrue) {
            setIsOpen(true)
        }
    }, [isTrue])



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{
                zIndex: "9999 !important"
            }}>
                <Toolbar>
                    {/* Toggle Icon on navbar */}
                    <Hidden mdUp>
                        <IconButton
                            onClick={toggle}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Hidden>

                    {/* App Name */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Chrome Extension
                    </Typography>


                    {/* user profile */}
                    <UserProfile />
                </Toolbar>
            </AppBar>

            {/* sidebar */}
            <SidePanel isOpen={isOpen} toggleSidePanel={toggle} />

            {/* Main Content */}
            <Box sx={{
                paddingLeft: !isOpen ? "39px" : "280px",
                paddingTop: "86px",
                paddingRight: "39px",
                textAlign: "justify"
            }}>
                {children}
            </Box>
        </Box>
    );
}
