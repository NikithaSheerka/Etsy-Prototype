import React, { useEffect, useContext, useState } from "react"
import { useHistory, useParams, Link } from "react-router-dom"
import Footer from "./Footer"
import Header from "./Header"
import { GlobalContext } from "../context/Provider"
import { productsAction } from "../context/actions/productsAction"
import ShopName from "./ShopName"
import axios from "axios"
import { Dimmer, Loader } from "semantic-ui-react"
import axiosInstance, { baseURL } from "../helpers/axiosInstance"
import { putCartAction } from "../context/actions/cartAction"
import { BsSuitHeartFill } from "react-icons/bs"
const ItemOverview = () => {
  const { id } = useParams()
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(false)
  const [productQuantity, setProductQuantity] = useState(0)
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const [msg, setMsg] = useState(false)
  const [msg2, setMsg2] = useState(false)
  const {
    user,
    products: { data },
  } = globalState
  const userId = user?.userId
  useEffect(() => {
    setLoading(true)
    console.log("product page")
    window.scrollTo(0, 0)
    axiosInstance()
      .get(`/users/${userId}/products/${id}`)
      .then((response) => {
        console.log("response.data", response.data)
        setProduct(response.data)
        product.quantity >= 20
          ? setProductQuantity(20)
          : setProductQuantity(product.quantity)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [])

  const addToCart = (productId) => {
    const token = localStorage.getItem("token")
    if (token) {
      console.log(productId)
      console.log(userId)
      putCartAction(userId, productId)(globalDispatch)
      //console.log("HI put cart action dispatch");
      setMsg2(true)
      setTimeout(() => {
        setMsg2(false)
      }, 2000)
    }
  }

  const handleFavProduct = async (productId) => {
    const token = localStorage.getItem("token")
    if (token) {
      const response = await axiosInstance().post(
        `/users/${userId}/favorites`,
        { productId }
      )
      if (response && response.data) {
        console.log("Item Added To Favorites Successfully")
        setMsg(true)
        setTimeout(() => {
          setMsg(false)
        }, 2000)
      } else {
        console.log("Error adding favorites")
      }
    }
  }

  let handleQuantityChange = (e) => {
    setProductQuantity(e.target.value)
  }

  const shopUrl = `/users/${userId}/shops/${product.shopId}`

  return (
    // <div className="py-5">
    <div>
      <Header />
      {loading ? (
        <div className='container' style={{ marginTop: "250px" }}>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        product && (
          <div className='container' style={{ marginTop: "180px" }}>
            <div className='row gx-4 gx-lg-5 align-items-center'>
              <div className='col-md-6'>
                <img
                  className='card-img-top mb-5 mb-md-0'
                  src={
                    product.imageUrl
                      ? product.imageUrl
                      : "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                  }
                  style={{ width: "100%", height: "500px" }}
                  alt='...'
                />
              </div>
              <div className='col-md-6'>
                <div className='small mb-1'>
                  Star Seller | {product.salesCount} Sales |{" "}
                  <i className='fa fa-star'></i> 4.5{" "}
                </div>
                <div className='mb-1 underline'>
                  <Link to={shopUrl}>
                    {" "}
                    <u>{product.shopName}</u>{" "}
                  </Link>
                </div>
                <div className='row'>
                  <div className='col-md-10'>
                    <h3 className='display-5 fw-bolder'>{product.name}</h3>
                  </div>
                  <div className='col-md-2'>
                    <button
                      className='btn btn-circle btn-sm float-right'
                      type='button'
                      onClick={() => handleFavProduct(id)}
                    >
                      <BsSuitHeartFill />
                    </button>
                  </div>
                </div>
                {product.quantity > 0 ? null : (
                  <h3>
                    <span class='badge badge-secondary'>Out of Stock</span>
                  </h3>
                )}
                <div className='fs-5 mb-2'>
                  {/* <span className="text-decoration-line-through">$45.00</span> */}
                  <h4>${product.price}</h4>
                </div>
                <p>{product.description}</p>
                <div className='form-group w-100'>
                  <select
                    className='form-select'
                    onChange={handleQuantityChange}
                  >
                    <option value='0' disabled>
                      Select Quantity
                    </option>
                    {[...Array(productQuantity)].map((_, index) => {
                      return <option value={index + 1}>{index + 1}</option>
                    })}
                  </select>
                </div>
                <br />
                <br /> <br />
                <button
                  className='btn btn-dark w-100'
                  // to='/cart'
                  onClick={() => addToCart(id)}
                  disabled={product.quantity <= 0}
                >
                  <i className='bi-cart-fill me-1'></i>
                  Add to cart
                </button>
                <br /> <br />
                {msg && (
                  <div class='alert alert-success' role='alert'>
                    Item added to Favorites Successfully!
                  </div>
                )}
                {msg2 && (
                  <div class='alert alert-success' role='alert'>
                    Item added to cart Successfully!
                  </div>
                )}
                <div></div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ItemOverview
