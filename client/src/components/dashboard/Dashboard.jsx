import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../ContextProvider/Context'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate()

    const [data, setData] = useState(false);
    const { loginData, setLoginData } = useContext(LoginContext)

    const DashboardValid = async () => {
        let token = localStorage.getItem('usersdatatoken')
        const response = await fetch("http://localhost:5000/api/user/loggedUser", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        })

        const data = await response.json()
        if (data.status !== 'success' || !data) {
            console.log("dashboard error");
            navigate("/app-error")
        } else {
            setLoginData(data)
            console.log("dashboard success");
            navigate("/dashboard")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            DashboardValid()
            setData(true)
        }, 2000)
    }, [])

    return (
        <>
            {
                data ?
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img style={{ width: '200px', marginTop: 20 }} src='./person_dashboard.png' alt='profile' />\
                            <h1>User Email: {loginData ? loginData.user.email : ""}</h1>
                            <p><NavLink to='/changepassword'>Click Here</NavLink> to change password</p>
                        </div>
                    </> : <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <CircularProgress />
                        </Box>
                    </>
            }
        </>
    )
}

export default Dashboard