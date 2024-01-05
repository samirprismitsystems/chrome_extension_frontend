import { useAuth0 } from '@auth0/auth0-react'
import { Typography } from '@mui/material'
import AuthGuard from '../../authGuard/AuthGuard'
import Utils from '../../utils/utils'
import MenuAppBar from '../MenuAppBar/MenuAppBar'

const ProfilePage = () => {
    const { user } = useAuth0()

    return (
        <AuthGuard>
            <MenuAppBar>
                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Full Name</span> : {Utils.getContent(user?.nickname)}</Typography>
                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Email</span> : {Utils.getContent(user?.email)}</Typography>
            </MenuAppBar>
        </AuthGuard>
    )
}

export default ProfilePage
