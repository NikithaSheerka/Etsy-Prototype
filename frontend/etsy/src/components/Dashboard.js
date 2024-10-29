import React, { useContext } from "react"
import Header from "./Header"
import Footer from "./Footer"
import { Link } from "react-router-dom"
import { GlobalContext } from "../context/Provider"
import Home from "./Home"

// private dashboard
const Dashboard = () => {
  const {
    authState: { auth: data },
  } = useContext(GlobalContext)
  const user = data.data?.data
  console.log("user", user)
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  )
}

export default Dashboard
