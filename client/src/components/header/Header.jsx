import './header.css'
import React, { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { LoginContext } from '../ContextProvider/Context'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';


const Header = () => {

    const navigate = useNavigate()

    const { loginData, setLoginData } = useContext(LoginContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToLogin = () => {
        navigate("/")
    }

    const goToDashboard = () => {
        navigate("/dashboard")
    }

    const logoutUser = async () => {
        let token = localStorage.getItem('usersdatatoken')
        const response = await fetch("http://localhost:5000/api/user/logout", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": token,
                Accept: "application/json"
            }
        })

        const data = await response.json()
        if (data.status !== 'success') {
            navigate("/app-error")
        } else {
            console.log("loggedOut");
            localStorage.removeItem('usersdatatoken')
            setLoginData(false)
            navigate("/")
        }
    }

    return (
        <>
            <header>
                <nav><h1>AUTH SYSTEM</h1>
                    <div className='avatar'>
                        {
                            loginData.user ?
                                <Avatar onClick={handleClick} style={{ backgroundColor: 'green', fontWeight: 'bold', textTransform: 'capitalize' }}>{loginData.user.name[0].toUpperCase()}</Avatar> :
                                <Avatar onClick={handleClick} style={{ backgroundColor: 'black' }}></Avatar>
                        }
                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}>
                        {
                            loginData.user ? (
                                <div>
                                    <MenuItem onClick={() => {
                                        goToDashboard()
                                        handleClose()
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        logoutUser()
                                        handleClose()
                                    }}>Logout</MenuItem>
                                </div>
                            ) : (
                                <div>
                                    <MenuItem onClick={() => {
                                        goToLogin()
                                        handleClose()
                                    }}>Profile</MenuItem>

                                </div>
                            )
                        }
                    </Menu>
                </nav>
            </header>
        </>
    )
}

export default Header