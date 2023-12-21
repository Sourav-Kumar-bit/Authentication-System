import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

    const navigate = useNavigate()
    const { id, token } = useParams();

    const [userData, setUserData] = useState({
        password: "",
        password_confirmation: "",
    })
    const [message, setMessage] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showCPass, setShowCPass] = useState(false)

    const userValid = async () => {
        const data = await fetch(`http://localhost:5000/api/user/resetPassword/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const response = await data.json()
        if (response.status === "success") {
            console.log("valid user");
        } else {
            console.log("Invalid user");
            navigate('*')
        }
    }

    const setData = (e) => {
        const { name, value } = e.target
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const sendpassword = async (e) => {
        e.preventDefault();

        const { password, password_confirmation } = userData
        if (password === "") {
            alert("please enter your password")
        } else if (password.length < 6) {
            alert("please enter a valid password")
        } else if (password_confirmation === "") {
            alert("please confirm your password")
        } else if (password_confirmation.length < 6) {
            alert("please enter valid confirm password")
        } else if (password !== password_confirmation) {
            alert("Passwords mismatch")
        } else {
            const data = await fetch(`http://localhost:5000/api/user/${id}/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            const response = await data.json()

            if (response.status === "success") {
                console.log("Password reset success");
                setUserData({ ...userData, password: "", password_confirmation: "" })
                setMessage(true)
                navigate('/')
            } else {
                console.log("Token Expired");
            }
        }
    }

    useEffect(() => {
        userValid()
    }, [])

    return (
        <>
            <section>
                <div className='form_data'>
                    <div className="form_heading">
                        <h1>Reset Password</h1>
                    </div>
                    {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password Succesfully Updated </p> : ""}
                    <form className='btn'>
                        <div className="form_input">
                            <label htmlFor='password'>New Password</label>
                            <div className="two">
                                <input type={!showPass ? 'password' : 'text'} value={userData.password} onChange={setData} name='password' id='password' placeholder='Enter New Password' />
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
                        <button type='submit' onClick={sendpassword} className='btn'>Change</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword