import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "semantic-ui-react"
import logout from "../context/actions/logout"
import { GlobalContext } from "../context/Provider"
import { productsAction } from "../context/actions/productsAction"
import { useHistory } from "react-router-dom"
import { BiStoreAlt } from "react-icons/bi"
import { BsSuitHeartFill } from "react-icons/bs"
import { CgShoppingCart } from "react-icons/cg"

const Header = () => {
  const {
    authState: { auth: data },
    authDispatch,
    globalDispatch,
    globalState,
  } = useContext(GlobalContext)
  // const user = data.data?.data
  const userId = globalState?.user?.userId
  const shopId = globalState?.user?.shopId
  // || globalState?.shop?.data?._id
  const [query, setQuery] = useState("")

  const history = useHistory()
  console.log("user from authState Header", data)
  console.log("from globalState Header", globalState)

  useEffect(() => {
    console.log("Search Items are", query)

    console.log("products Search action dispatch")
    productsAction(userId, query)(globalDispatch)
  }, [query, shopId])

  const handleLogout = () => {
    logout(history)(globalDispatch)
    logout(history)(authDispatch)
  }

  const shopLink = `/users/${globalState.user.userId}/shops/${shopId}`

  return (
    <header className='header'>
      <div className='main_nav_container'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12 text-right'>
              <div className='logo_container'>
                <Link to='/'>
                  <span>Etsy</span>
                  {/* <img
                    src='../assets/images/Etsy_logo.png'
                    alt='Etsy Logo'
                    style={{ height: "20px" }}
                  /> */}
                </Link>
              </div>
              <nav className='navbar'>
                <ul className='navbar_menu'>
                  <li>
                    <Input
                      icon={{ name: "search", link: true }}
                      placeholder='Search for anything'
                      style={{ width: "370px" }}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </li>
                  {globalState.user?.userId === null ? (
                    <>
                      <li>
                        <Link to='/register'>
                          <i
                            className='fa fa-user-plus'
                            style={{ fontSize: "18px" }}
                            aria-hidden='true'
                          ></i>{" "}
                          Register
                        </Link>{" "}
                      </li>
                      <li>
                        <Link to='/login'>
                          <i
                            className='fa fa-sign-in'
                            style={{ fontSize: "20px" }}
                            aria-hidden='true'
                          ></i>{" "}
                          SignIn{" "}
                        </Link>{" "}
                      </li>
                    </>
                  ) : null}
                </ul>
                <ul className='navbar_user'>
                  <li>
                    <Link to='/favorites'>
                      {/* <i className='fa fa-heart' aria-hidden='true'></i> */}
                      <BsSuitHeartFill style={{ fontSize: "18px" }} />
                    </Link>
                  </li>
                  {/* <li>
                    <Link to='/editprofile'>
                      <i className='fa fa-user' aria-hidden='true'></i>
                    </Link>
                  </li> */}
                  {/* &&
                  globalState.shop?.data == null */}
                  {globalState.user?.shopId == null &&
                  globalState.shop?.data?.createdBy !==
                    globalState.user?.userId ? (
                    <li>
                      <Link to='/create-shop'>
                        <i
                          className='fa fa-plus-square'
                          style={{ fontSize: "21px" }}
                          aria-hidden='true'
                        ></i>{" "}
                        {/* Create Shop */}
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link to={shopLink}>
                        {/* <i className='fa fa-building' aria-hidden='true'></i>{" "} */}
                        <BiStoreAlt style={{ fontSize: "20px" }} />
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to='/cart'>
                      <CgShoppingCart style={{ fontSize: "20px" }} />
                      {/* <i className='fa fa-shopping-cart' aria-hidden='true'></i> */}
                      {/* <span id='checkout_items' className='checkout_items'>
                        2
                      </span> */}
                    </Link>
                  </li>
                </ul>

                {globalState.user?.userId !== null ? (
                  <ul className='navbar_menu' style={{ marginLeft: "30px" }}>
                    <li>
                      <button onClick={handleLogout} className='btn btn-danger'>
                        <i className='fa fa-sign-out' aria-hidden='true'></i>{" "}
                        {/* Logout */}
                      </button>
                    </li>
                  </ul>
                ) : null}

                <div className='hamburger_container'>
                  <i className='fa fa-bars' aria-hidden='true'></i>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className='fs_menu_overlay'></div>
      <div className='hamburger_menu'>
        <div className='hamburger_close'>
          <i className='fa fa-times' aria-hidden='true'></i>
        </div>
        <div className='hamburger_menu_content text-right'>
          <ul className='menu_top_nav'>
            <li className='menu_item has-children'>
              <Link to='/'>
                usd
                <i className='fa fa-angle-down'></i>
              </Link>
              <ul className='menu_selection'>
                <li>
                  <Link to='/'>cad</Link>
                </li>
                <li>
                  <Link to='/'>aud</Link>
                </li>
                <li>
                  <Link to='/'>eur</Link>
                </li>
                <li>
                  <Link to='/'>gbp</Link>
                </li>
              </ul>
            </li>
            <li className='menu_item has-children'>
              <Link to='/'>
                English
                <i className='fa fa-angle-down'></i>
              </Link>
              <ul className='menu_selection'>
                <li>
                  <Link to='/'>French</Link>
                </li>
                <li>
                  <Link to='/'>Italian</Link>
                </li>
                <li>
                  <Link to='/'>German</Link>
                </li>
                <li>
                  <Link to='/'>Spanish</Link>
                </li>
              </ul>
            </li>
            {/* <li className="menu_item has-children">
            {/* <Link to="#">
              My Account
              <i className="fa fa-angle-down"></i>
            </Link> */}
            {/* <ul className="menu_selection">  */}

            {/* </ul> */}
            {/* </li> */}
            <li className='menu_item'>
              <Link to='/'>home</Link>
            </li>
            <li className='menu_item'>
              <Link to='/'>shop</Link>
            </li>
            <li className='menu_item'>
              <Link to='/'>promotion</Link>
            </li>
            <li className='menu_item'>
              <Link to='/'>pages</Link>
            </li>
            <li className='menu_item'>
              <Link to='/'>blog</Link>
            </li>
            <li className='menu_item'></li>
            <li className='menu_item'>
              <Link to='/login'>
                <i className='fa fa-sign-in' aria-hidden='true'></i>Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
