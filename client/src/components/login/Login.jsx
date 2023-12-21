import React, { useState } from 'react'
import '../common.css'
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()

    const [showPass, setShowPass] = useState(false)
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    })

    const setData = (e) => {
        const { name, value } = e.target
        setUserData(() => {
            return {
                ...userData,
                [name]: value
            }
        })
    }

    const loginUser = async (e) => {
        e.preventDefault()

        const { email, password } = userData
        if (email === "") {
            toast.error("Email is required!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password === "") {
            toast.error("Please enter password", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password.length < 6) {
            toast.error("Enter a valid password", {
                position: "top-center",
                autoClose: 3000,
            });
        } else {
            const data = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })
            const response = await data.json()
            if (response.status === 'success') {
                toast.success("Login Successful!", {
                    position: "top-center"
                });
                navigate('/dashboard')
                localStorage.setItem("usersdatatoken", response.token)
                setUserData({ ...userData, email: "", password: "" })
            } else {
                toast.error("Invalid Credentials", {
                    position: "top-center"
                });
            }
        }
    }

    return (
        <>
            <section>
                <div className='form_data'>
                    <div className="form_heading">
                        <h1>Welcome Back, Log In</h1>
                        <p>Hi, we are glad to have you back. Please login.</p>
                    </div>
                    <form onSubmit={loginUser} className='btn'>
                        <div className="form_input">
                            <label htmlFor='email'>Email</label>
                            <input type='email' value={userData.email} onChange={setData} name='email' id='email' placeholder='Enter Your Email' />
                        </div>
                        <div className="form_input">
                            <label htmlFor='password'>Password</label>
                            <div className="two">
                                <input type={!showPass ? 'password' : 'text'} name='password' id='password' value={userData.password} onChange={setData} placeholder='Enter Your Password' />
                                <div className="showpass" onClick={() => setShowPass(!showPass)}>
                                    {!showPass ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='btn'>Login</button>
                        <p>Don't have an Account? <NavLink to='/register'>Sign Up</NavLink></p>
                        <p style={{ color: 'black', fontWeight: 'bold' }}>Forgot Password? <NavLink to='/reset-password'>Click Here</NavLink></p>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login