import "./App.css"
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"
// import Routes from "./Routes"
import { GlobalProvider } from "./context/Provider"
import routes from "./routes/index"
import isAuthenticated from "./utils/isAuthenticated"

const RenderRoute = (route) => {
  const history = useHistory()

  document.title = route.title || "Etsy"

  if (route.needsAuth && !isAuthenticated()) {
    history.push("/login")
  }
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component {...props} />}
    ></Route>
  )
}

function App() {
  return (
    <GlobalProvider>
      <div className='MainDiv'>
        <BrowserRouter>
          {/* <Routes /> */}
          <Switch>
            {routes.map((route, index) => (
              <RenderRoute {...route} key={index} />
            ))}
          </Switch>
        </BrowserRouter>
      </div>
    </GlobalProvider>
  )
}

export default App
