import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useAuth0 } from '@auth0/auth0-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { enums } from '../../enum';
import ApiServices from '../../services/ApiServices';
import Utils from '../../utils/utils';


interface ISidePanelProps {
    isOpen: boolean;
    toggleSidePanel: () => void;
}

const lstSideBarItem = [
    { id: 1, name: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    { id: 2, name: "Products", link: "/products", icon: <AddShoppingCartIcon /> },
    { id: 3, name: "Orders", link: "/orders", icon: <SellIcon /> },
    { id: 4, name: "Salla Account Login", link: "/sallaLogin", icon: <LoginIcon /> },
    { id: 5, name: "Ali Express Login", link: "/aliExpressLogin", icon: <LoginIcon /> },
    { id: 6, name: "Setting", link: "/settings", icon: <SettingsIcon /> },
]

export default function SidePanel(props: ISidePanelProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isTrue = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useAuth0();

    const getActionOnMediaQuery = () => {
        if (isTrue) {
            props.toggleSidePanel();
        }
    }

    const sallaLogin = async () => {
        try {
            if (Utils.getItem(enums.SALLA_TOKEN)) {
                Utils.showSuccessMessage('Salla account verified already!')
                return null;
            }

            const data = await ApiServices.sallaAccountAuthorization(user?.sub);
            if (data && data.link) {
                window.open(data.link, "_blank")
                return null;
            }
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        }
    };

    const aliLogin = async () => {
        try {
            if (Utils.getItem(enums.ALI_EXPRESS_TOKEN)) {
                Utils.showSuccessMessage('Ali express account verified already!')
                return null;
            }
            // const data = await ApiServices.aliExpressAuthorization(user?.sub);
            // if (data && data.link) {
            window.open("https://prismcodehub.com/aliexpress?login=12312", "_blank")
            // return null;
            // }

            // Utils.showErrorMessage('Not able to show the ali express login!')
        } catch (ex: any) {
            Utils.showErrorMessage(ex.message)
        }
    };

    const list = () => (
        <Box
            sx={{ width: !props.isOpen ? 'auto' : 250, mt: "5rem !important" }}
            role="presentation"
        >
            <List>
                {lstSideBarItem.map((item, index) => {
                    return (
                        <Box key={item.id}>
                            {lstSideBarItem.length === index + 3 && (
                                <Divider />
                            )}
                            <ListItem disablePadding>
                                <ListItemButton onClick={async () => {
                                    if (item.id === 4) {
                                        await sallaLogin();
                                        return null;
                                    }

                                    if (item.id === 5) {
                                        await aliLogin();
                                        return null;
                                    }

                                    navigate(item.link)
                                }}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={Utils.getContent(item.name)} />
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    )
                })}
            </List>
        </Box>
    );

    return (
        <React.Fragment>
            <Drawer
                anchor={"left"}
                open={props.isOpen}
                variant="persistent"
                onClose={getActionOnMediaQuery}
            >
                {list()}
            </Drawer>
        </React.Fragment>
    );
}
