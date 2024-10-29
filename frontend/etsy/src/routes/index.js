import Register from "../components/register.js"
import Login from "../components/Login.js"
import App from "../App.js"
import ShopName from "../components/ShopName.js"
import ShopHome from "../components/ShopHome.js"
import Home from "../components/Dashboard.js"
import ProfilePage from "../components/ProfilePage.js"
import Favorites from "../components/Favorites.js"
import Main from "../components/Main.js"
import Cart from "../components/Cart.js"
import ItemOverview from "../components/ItemOverview.js"
import PurchasesPage from "../components/PurchasesPage.js"

const routes = [
  {
    path: "/register",
    component: Register,
    title: "Register",
    needsAuth: false,
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    title: "Login",
    needsAuth: false,
    exact: true,
  },
  {
    path: "/create-shop",
    component: ShopName,
    title: "Create Shop",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/users/:userId/shops/:shopId",
    component: ShopHome,
    title: "Shop | Etsy",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/editprofile",
    component: ProfilePage,
    title: "Profile Page",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/favorites",
    component: Favorites,
    title: "Favorites",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/product/:id",
    component: ItemOverview,
    title: "Product Page | Etsy",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/cart",
    component: Cart,
    title: "Cart | Etsy",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/purchases",
    component: PurchasesPage,
    title: "Purchases | Etsy",
    needsAuth: true,
    exact: true,
  },
  {
    path: "/",
    component: Main,
    title: "Etsy",
    needsAuth: false,
    exact: true,
  },
]

export default routes
