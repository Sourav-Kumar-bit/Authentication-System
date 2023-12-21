import React, { useContext, useEffect, useState } from 'react'
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import ResetMail from './components/password/ResetMail';
import ForgotPassword from './components/password/ForgotPassword';
import ChangePassword from './components/password/ChangePassword';
import Error from "./components/error/Application-err";
import NotFound from "./components/error/Not-found";
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import { LoginContext } from "./components/ContextProvider/Context";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function App() {
  const [data, setData] = useState(false);
  const { loginData, setLoginData } = useContext(LoginContext)
  const navigate = useNavigate()

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
    if (data.status === 'success' && data) {
      setLoginData(data)
      navigate("/dashboard")
    }
  }

  useEffect(() => {
    setTimeout(()=> {
      DashboardValid()
      setData(true)
    }, 2000)
    
  }, [])

  return (
    <>
      {
        data ?
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/changepassword' element={<ChangePassword />} />
              <Route path="/reset-password" element={<ResetMail />} />
              <Route path='/forgotpassword/:id/:token' element={<ForgotPassword />} />
              <Route path="/app-error" element={<Error />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </> : <>
              <Box sx={{ display:'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
              </Box>
          </>
      }
    </>
  );
}

export default App;
