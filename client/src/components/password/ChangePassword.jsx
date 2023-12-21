import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const ChangePassword = () => {

  const [id, setId] = useState("")
  const [userData, setUserData] = useState({
    password: "",
    password_new: "",
    password_confirmation: "",
  })
  const [message, setMessage] = useState(false)
  const [showOldPass, setShowOldPass] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showCPass, setShowCPass] = useState(false)

  const userValid = async () => {
    let token = localStorage.getItem('usersdatatoken')
    const data = await fetch("http://localhost:5000/api/user/loggedUser", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authorization": token
      }
    })
    const response = await data.json()
    if (response.status === "success") {
      setId(response.user._id)
      console.log("valid user");
    } else {
      console.log("Invalid user");
      // navigate('*')
    }
  }

  const setData = (e) => {
    const { name, value } = e.target
    setMessage(false)
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const changePassword = async (e) => {
    e.preventDefault();

    const { password, password_new, password_confirmation } = userData
    if (password_new === "") {
      alert("please enter your password")
    } else if (password_new.length < 6) {
      alert("please enter a valid password")
    } else if (password_confirmation === "") {
      alert("please confirm your password")
    } else if (password_new !== password_confirmation) {
      alert("Passwords mismatch")
    } else {
      let token = localStorage.getItem('usersdatatoken')
      const data = await fetch(`http://localhost:5000/api/user/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token,
          "id": id
        },
        body: JSON.stringify({ password, password_new })
      });

      const response = await data.json()
      if (response.status === "success") {
        console.log("Password reset success");
        setUserData({ ...userData, password: "", password_new: "", password_confirmation: "" })
        setMessage(true)
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
            <h1>Change Password</h1>
          </div>
          {message ? <p style={{ color: "green", fontWeight: "bold" }}>Password Succesfully Updated </p> : ""}
          <form className='btn'>
            <div className="form_input">
              <label htmlFor='password'>Old Password</label>
              <div className="two">
                <input type={!showOldPass ? 'password' : 'text'} value={userData.password} onChange={setData} name='password' id='password' placeholder='Enter Old Password' />
                <div className="showpass" onClick={() => setShowOldPass(!showOldPass)}>
                  {!showOldPass ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <div className="form_input">
              <label htmlFor='password_new'>New Password</label>
              <div className="two">
                <input type={!showPass ? 'password' : 'text'} value={userData.password_new} onChange={setData} name='password_new' id='password_new' placeholder='Enter New Password' />
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
            <button type='submit' onClick={changePassword} className='btn'>Change</button>
            <p><NavLink to='/dashboard'>Go Back</NavLink></p>
          </form>
        </div>
      </section>
    </>
  )
}

export default ChangePassword