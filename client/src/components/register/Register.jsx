import React from 'react'
import '../common.css'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = () => {

    const navigate = useNavigate()

    const [showPass, setShowPass] = useState(false)
    const [showCPass, setShowCPass] = useState(false)
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        tc: false
    })

    const setData = (e) => {
        if (e.target && e.target.hasOwnProperty('checked')) {
            const { name, checked } = e.target
            setUserData((prev) => {
                return {
                    ...prev,
                    [name]: checked
                }
            })
        } else {
            const { name, value } = e.target
            setUserData((prev) => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
    }

    const addUserData = async (e) => {
        e.preventDefault()

        const { name, email, password, password_confirmation, tc } = userData
        if (name === "") {
            toast.warning("Name is required!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (name.length < 4) {
            toast.error("Invalid name", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (email === "") {
            toast.warning("email is required!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (!email.includes('@')) {
            toast.warning("Please enter a valid email", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password === "") {
            toast.warning("Password is required!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password.length < 6) {
            toast.warning("Password must be atleast 6 char!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password_confirmation === "") {
            toast.warning("Password confirmation is required!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (password !== password_confirmation) {
            toast.warning("Password mismatch!", {
                position: "top-center",
                autoClose: 3000,
            });
        } else {
            const data = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password, password_confirmation, tc
                })
            })
            const response = await data.json()
            if (response.status === 'success') {
                toast.success("Registration Successful!", {
                    position: "top-center",
                    autoClose: 3000,
                });
                navigate('/')
                setUserData({ ...userData, name: "", email: "", password: "", password_confirmation: "", tc: false })
            } else {
                toast.error("Some error occured, please try again", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setUserData({ ...userData, tc: false })
            }
        }
    }

    return (
        <>
            <section>
                <div className='form_data'>
                    <div className="form_heading">
                        <h1>Sign Up</h1>
                        <p style={{ textAlign: 'center' }}>Hi, we are glad that you will be using this Authenticator <br /> to save your important details. Hope you will like it.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor='name'>Name</label>
                            <input type='text' value={userData.name} onChange={setData} name='name' id='name' placeholder='Enter Your Name' />
                        </div>
                        <div className="form_input">
                            <label htmlFor='email'>Email</label>
                            <input type='email' value={userData.email} onChange={setData} name='email' id='email' placeholder='Enter Your Email' />
                        </div>
                        <div className="form_input">
                            <label htmlFor='password'>Password</label>
                            <div className="two">
                                <input type={!showPass ? 'password' : 'text'} value={userData.password} onChange={setData} name='password' id='password' placeholder='Enter Your Password' />
                                <div className="showpass" onClick={() => setShowPass(!showPass)}>
                                    {!showPass ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <div className="form_input">
                            <label htmlFor='password'>Confirm Password</label>
                            <div className="two">
                                <input type={!showCPass ? 'password' : 'text'} value={userData.password_confirmation} onChange={setData} name='password_confirmation' id='password_confirmation' placeholder='Confirm Your Password' />
                                <div className="showpass" onClick={() => setShowCPass(!showCPass)}>
                                    {!showCPass ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <div className="form_checkbox">
                            <input style={{ marginLeft: '5px' }} onChange={setData} type='checkbox' name='tc' id='tc' value={userData.tc} /><span style={{ paddingLeft: '20px' }}> I agree to the terms & conditions.</span>
                        </div>

                        <button onClick={addUserData} className='btn'>Sign Up</button>
                        <p>Already have an Account? <NavLink to='/'>Log In</NavLink></p>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Register