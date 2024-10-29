import React, { useContext, useState } from "react"
import Header from "./Header"
import { GlobalContext } from "../context/Provider"
import { checkShopNameAction, shopAction } from "../context/actions/shopAction"
import axiosInstance from "../helpers/axiosInstance"
import { useHistory } from "react-router"

const ShopName = () => {
  const [shopName, setShopName] = useState("")
  const [shopBtn, setShopBtn] = useState(true)
  const [checkAvailabiltyState, setCheckAvailabiltyState] = useState({
    loading: null,
    error: null,
    available: null,
  })
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const history = useHistory()
  const {
    user,
    // checkShopName: { loading, error, data },
  } = globalState
  const userId = user?.userId
  const handleShopNameChange = (e) => {
    setShopName(e.target.value)
    setShopBtn(true)
  }
  const checkAvailabilityHandler = () => {
    console.log("shopName", shopName)
    // checkShopNameAction(userId, shopName)(globalDispatch)
    setCheckAvailabiltyState({ ...checkAvailabiltyState, loading: true })
    axiosInstance()
      .get(`/users/${userId}/shop/checkavailability?shopname=${shopName}`)
      .then((response) => {
        console.log("response from checkShopNameAction", response.data)
        setCheckAvailabiltyState({
          ...checkAvailabiltyState,
          available: response.data.available,
          loading: false,
        })
        if (response.data.available == true) {
          setShopBtn(false)
        }
      })
      .catch((error) => {
        console.log("error from checkShopNameAction", error)
        setCheckAvailabiltyState({
          ...checkAvailabiltyState,
          error: error,
          loading: false,
        })
      })
    console.log("checkAvailabiltyState", checkAvailabiltyState)
  }

  const handleCreateShop = () => {
    console.log("handleCreateShop")

    const data = {
      name: shopName,
      imageUrl:
        "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/shop-icon.png",
    }
    console.log("data from handleCreateShop", data)
    axiosInstance()
      .post(`/users/${userId}/shops`, data)
      .then((response) => {
        console.log("response from create shop", response)
        console.log("shop id", response.data.shopId)
        shopAction(userId, response.data.shopId)(globalDispatch)
        history.push(`/users/${userId}/shops/${response.data.shopId}`)
      })
      .catch((error) => {
        console.log("error from create shop", error)
      })
  }

  return (
    <div>
      <Header />
      <div className='container' style={{ marginTop: "250px" }}>
        <h2 className='nameShop'>Name your Shop</h2>
        <h3 className='nameShop'>
          Choose a memorable name that reflects your style.
        </h3>
        <div class='row'>
          <div class='col-xl-12 col-lg-12 col-md-12'></div>
        </div>
        <div className='nameShopContainer'>
          {/* <div className='col-xl-3 col-lg-3 col-md-3'></div> */}
          <div class='col-xl-6 col-lg-6 col-md-6'>
            <div class='input-group rounded'>
              <input
                type='text'
                class='form-control rounded'
                placeholder='Enter Shop Name'
                value={shopName}
                aria-label='Search'
                aria-describedby='search-addon'
                onChange={handleShopNameChange}
              />
              {/* <span class="input-group-text border-0" id="search-addon">
                        <i class="fa fa-search fa-2x"></i>
                    </span> */}
              <button
                className='btn btn-dark'
                onClick={checkAvailabilityHandler}
              >
                Check Availability
              </button>
            </div>
            <br />
            <div>
              <p className='nameShop text-muted'>
                Your shop name will appear in your shop and next to each of your
                listings throughout Etsy.
              </p>
            </div>
            <br />
            {checkAvailabiltyState.loading && <p>Loading</p>}
            {checkAvailabiltyState.error && <p>Oops, Something went wrong.</p>}
            {checkAvailabiltyState.available == true ? (
              <div class='alert alert-success' role='alert'>
                Shop Name Available!
              </div>
            ) : checkAvailabiltyState.available == false ? (
              <div class='alert alert-danger' role='alert'>
                Shop Name Not Available!
              </div>
            ) : null}
            <br />
            <button
              onClick={handleCreateShop}
              disabled={shopBtn}
              className='btn btn-dark w-100'
            >
              Create Shop
            </button>
          </div>
          {/* <div className='col-xl-3 col-lg-3 col-md-3'></div> */}
        </div>
      </div>
    </div>
  )
}

export default ShopName
