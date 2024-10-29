import { useContext, useEffect, useState, useCallback } from "react"
import { GlobalContext } from "../context/Provider"
import { cartAction, deleteCartAction } from "../context/actions/cartAction"
import { Link, useHistory } from "react-router-dom"
import axiosInstance from "../helpers/axiosInstance"
import Header from "./Header"
import { UPDATE_CART_ITEM_SUCCESS } from "../context/actions/actionTypes"
import { Dimmer, Loader } from "semantic-ui-react"

const Cart = () => {
  const history = useHistory()
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const { authState, authDispatch } = useContext(GlobalContext)
  const { user, cart } = globalState
  const userId = user?.userId
  const [msg, setMsg] = useState(false)

  useEffect(() => {
    cartAction(userId)(globalDispatch)
  }, [])

  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  console.log("Global Cart State is", globalState)
  console.log("Cart is ", cart)

  const cartItems = cart?.data ? cart.data.cartItems : []

  useEffect(() => {
    setCartCount(
      cartItems.reduce(
        (totalItems, cartItem) => (totalItems += cartItem.quantity),
        0
      )
    )
    setCartTotal(
      cartItems.reduce(
        (totalPrice, cartItem) => (totalPrice += cartItem?.product?.price),
        0
      )
    )
  }, [cartItems])

  const deleteCartItem = useCallback((cartId) => {
    console.log("I'm delete cart")
    deleteCartAction(userId, cartId)(globalDispatch)
    // cartAction(userId)(globalDispatch);
  }, [])

  const checkOutCartItems = async () => {
    console.log(cartItems)
    axiosInstance()
      .post(`/users/${userId}/cart/checkout`)
      .then((response) => {
        console.log("response.data", response.data)
        setMsg(true)
        globalDispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: [] })
        history.push("/purchases")
        //setProduct(response.data)
        //setLoading(false)
      })
      .catch((err) => {
        //setLoading(false)
        console.log(err)
      })
  }

  let cartsDiv = cartItems.map((cartItem) => {
    return (
      <tr>
        <td data-th='Image'>
          <img
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src =
                "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
            }}
            src={
              cartItem?.product?.imageUrl
                ? cartItem?.product.imageUrl
                : "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
            }
            alt=''
            className='img-fluid d-none d-md-block rounded mb-2 shadow '
            style={{ width: "80px", height: "80px" }}
          />
        </td>
        <td data-th='Product'>
          <div className='row'>
            <div className='col-md-9 text-left mt-sm-2'>
              <h4>{cartItem?.product?.name}</h4>
              <p className='font-weight-light'>{cartItem?.product?.shopName}</p>
            </div>
          </div>
        </td>
        <td data-th='Price'>
          ${cartItem?.product?.price * cartItem?.quantity}
        </td>
        <td data-th='Quantity'>
          <input
            type='number'
            value={cartItem?.quantity}
            className='form-control text-center'
          />
          {cartItem?.quantity.toString}
        </td>
        <td className='actions' data-th=''>
          <div className='text-right'>
            <button
              className='btn btn-white border-secondary bg-white btn-md mb-2'
              onClick={() => deleteCartItem(cartItem?._id)}
            >
              <i className='fa fa-trash'></i>
            </button>
          </div>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <Header />
      {cart?.loading ? (
        <div className='container' style={{ marginTop: "250px" }}>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        cart?.data && (
          <div className='container' style={{ marginTop: "130px" }}>
            <div className='row w-100'>
              <div className='col-lg-12 col-md-12 col-12'>
                {msg && (
                  <div class='alert alert-success' role='alert'>
                    Order Placed Successfully !
                  </div>
                )}
                <h2 className='display-5 mb-2 text-center'>Shopping Cart</h2>
                <h4 className='mb-5 text-center'>
                  <i className='text-info font-weight-bold'> {cartCount}</i>{" "}
                  items in your cart
                </h4>
                <div class='col-12'>
                  {cartCount === 0 ? null : (
                    <table
                      id='shoppingCart'
                      className='table table-responsive w-100 d-block d-md-table'
                    >
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{cartsDiv}</tbody>
                    </table>
                  )}
                </div>
                {cartCount === 0 ? null : (
                  <div className='float-right text-right'>
                    <h3>
                      Total: <b>${cartTotal.toFixed(2)}</b>
                    </h3>
                  </div>
                )}
              </div>
            </div>
            <br /> <br /> <br />
            <div className='row mt-4 d-flex align-items-center'>
              <div className='col-sm-6 order-md-2 text-right'>
                <button
                  onClick={checkOutCartItems}
                  className='btn btn-dark mb-4 btn-lg pl-5 pr-5'
                  style={{ letterSpacing: "1px", fontSize: "16px" }}
                >
                  CHECKOUT
                </button>
              </div>
              <div className='col-sm-6 mb-3 mb-m-1 order-md-1 text-md-left'>
                <Link
                  to='/'
                  className='btn btn-link'
                  style={{ color: "black" }}
                >
                  <i className='fa fa-arrow-left mr-2'></i> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Cart
