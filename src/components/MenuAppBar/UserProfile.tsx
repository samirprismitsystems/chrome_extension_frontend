import { useAuth0 } from '@auth0/auth0-react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import Utils from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { logout } = useAuth0();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {Utils.isUserLoggedIn() && (
                <Box>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        sx={{
                            "&>svg": {
                                width: "34px !important",
                                height: "auto"
                            }
                        }}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            position: "absolute",
                            top: "3rem",
                            zIndex: "9999 !important"
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            handleClose();
                            navigate("/profile")
                        }}>My Profile</MenuItem>
                        <MenuItem onClick={() => {
                            handleClose();
                            // Utils.removeItem(enums.AUTH0_TOKEN)
                            // Utils.removeItem(enums.IS_LOGIN)
                            Utils.clearStorage();
                            Utils.showSuccessMessage('Successfully logout')
                            logout({ logoutParams: { returnTo: window.location.origin } })
                        }}>Logout</MenuItem>
                    </Menu>
                </Box>
            )}
        </>
    )
}

export default UserProfile
