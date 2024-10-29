import { LOGOUT_USER } from "./actionTypes"

export default (history) => (dispatch) => {
  localStorage.removeItem("token")
  localStorage.removeItem("userDetails")

  dispatch({
    type: LOGOUT_USER,
  })
  history.push("/")
}
