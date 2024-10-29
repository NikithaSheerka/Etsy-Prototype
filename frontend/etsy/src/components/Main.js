import React, { useContext, useEffect } from "react"
import { GlobalContext } from "../context/Provider"
import { useHistory } from "react-router-dom"
import Dashboard from "./Dashboard"

const Main = () => {
  const {
    authState: { auth: data },
  } = useContext(GlobalContext)
  const { globalDispatch, globalState } = useContext(GlobalContext)

  const user = data.data?.data
  console.log(user)
  useEffect(() => {
    if (user) {
      localStorage.setItem("userDetails", JSON.stringify(user))
    }
    console.log("globalState 1", globalState)
    if (localStorage.userDetails) {
      console.log(
        "userDetails",
        JSON.parse(localStorage.getItem("userDetails"))
      )
      globalDispatch({
        type: "SET_USER",
        payload: JSON.parse(localStorage.getItem("userDetails")),
      })
    }
  }, [data])

  // useEffect(() => {

  // }, [])

  console.log("globalState 2", globalState)

  return <Dashboard />
}

export default Main
