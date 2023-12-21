import React, { useState } from 'react'

const ResetMail = () => {

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState(false)

    const setVal = (e) => {
        setMessage(false)
        setEmail(e.target.value)
    }

    const sendLink = async (e) => {
        e.preventDefault()

        const data = await fetch("http://localhost:5000/api/user/send-password-reset-mail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email
                    })
                })

        const response = await data.json()
        if (response.status === "success") {
            console.log("Valid email");
            setEmail("")
            setMessage(true)
        } else {
            console.log("Invalid email");
        }
    }

    return (
        <>
            <section>
                <div className='form_data'>
                    <div className="form_heading">
                        <h1>Enter Your Email</h1>
                    </div>
                    {
                        message ? <p style={{ color: 'green', fontWeight: 'bold' }}>check your registered email to reset password</p> : null
                    }
                    <form className='btn'>
                        <div className="form_input">
                            <label htmlFor='email'>Email</label>
                            <input type='email' value={email} onChange={setVal} name='email' id='email' placeholder='Enter Your Registered Email Address' />
                        </div>
                        <button type='submit' onClick={sendLink} className='btn'>Send</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default ResetMail