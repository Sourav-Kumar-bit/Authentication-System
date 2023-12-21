import React, { createContext, useState } from 'react'

export const LoginContext = createContext("")

const Context = ({children}) => {

    const  [loginData, setLoginData] = useState("")

  return (
    <>
    <LoginContext.Provider value={{loginData, setLoginData}}>
        {children}
    </LoginContext.Provider>
    </>
  )
}

export default Context