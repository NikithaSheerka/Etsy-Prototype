import React, { useEffect, useContext, useState } from "react"
import { GlobalContext } from "../context/Provider"
import { useHistory, Link } from "react-router-dom"
import { productsAction } from "../context/actions/productsAction"
import { postFavoritesAction } from "../context/actions/favoritesAction"
import ProductCard from "./widgets/ProductCard"
import { putCartAction } from "../context/actions/cartAction"
import { Dimmer, Loader } from "semantic-ui-react"

const Home = () => {
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const {
    user,
    products: { data, loading, error },
  } = globalState
  const [fav, setFav] = useState(false)
  console.log("user from globalState", user?.userId)
  const userId = user?.userId
  // const shopId = user?.shopId

  useEffect(() => {
    console.log("products action dispatch")
    productsAction(userId)(globalDispatch)
  }, [userId])

  console.log("Global State from Home", globalState)

  const handleFavProduct = (productId) => {
    setFav(true)
    if (userId) {
      console.log("productId from handleFavProduct", productId)
      postFavoritesAction(productId, userId)(globalDispatch)
      console.log("global state after postFavoritesAction", globalState)
    }
    // setFav(false)
  }

  const addToCart = (productId) => {
    if (userId) {
      console.log(productId)
      putCartAction(userId, productId)(globalDispatch)
      console.log("HI put cart action dispatch")
    }
  }

  const productsDiv = data?.products.map((product, index) => {
    let pageLink = `/product/${product._id}`
    return (
      <ProductCard
        product={product}
        key={index}
        pageLink={pageLink}
        handleFavProduct={handleFavProduct}
        addToCart={addToCart}
      />
    )
  })

  return (
    <>
      {/* {loading ? (
        <div style={{ marginTop: "250px" }}>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        data && ( */}
      <div>
        <div className='new_arrivals'>
          <div className='container'>
            <div className='row' style={{ marginTop: "100px" }}>
              {productsDiv}{" "}
            </div>
          </div>
        </div>
        <div className='benefit'>
          <div className='container'>
            <div className='row benefit_row'>
              <div className='col-lg-3 benefit_col'>
                <div className='benefit_item d-flex flex-row align-items-center'>
                  <div className='benefit_icon'>
                    <i className='fa fa-truck' aria-hidden='true'></i>
                  </div>
                  <div className='benefit_content'>
                    <h6>free shipping</h6>
                    <p>Suffered Alteration in Some Form</p>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 benefit_col'>
                <div className='benefit_item d-flex flex-row align-items-center'>
                  <div className='benefit_icon'>
                    <i className='fa fa-money' aria-hidden='true'></i>
                  </div>
                  <div className='benefit_content'>
                    <h6>cach on delivery</h6>
                    <p>The Internet Tend To Repeat</p>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 benefit_col'>
                <div className='benefit_item d-flex flex-row align-items-center'>
                  <div className='benefit_icon'>
                    <i className='fa fa-undo' aria-hidden='true'></i>
                  </div>
                  <div className='benefit_content'>
                    <h6>45 days return</h6>
                    <p>Making it Look Like Readable</p>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 benefit_col'>
                <div className='benefit_item d-flex flex-row align-items-center'>
                  <div className='benefit_icon'>
                    <i className='fa fa-clock-o' aria-hidden='true'></i>
                  </div>
                  <div className='benefit_content'>
                    <h6>opening all week</h6>
                    <p>8AM - 09PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='newsletter'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-6'>
                <div className='newsletter_text d-flex flex-column justify-content-center align-items-lg-start align-items-md-center text-center'>
                  <h4>Newsletter</h4>
                  <p>
                    Subscribe to our newsletter and get 20% off your first
                    purchase
                  </p>
                </div>
              </div>
              <div className='col-lg-6'>
                <form action='post'>
                  <div className='newsletter_form d-flex flex-md-row flex-column flex-xs-column align-items-center justify-content-lg-end justify-content-center'>
                    <input
                      id='newsletter_email'
                      type='email'
                      placeholder='Your email'
                      required='required'
                      data-error='Valid email is required.'
                    />
                    <button
                      id='newsletter_submit'
                      type='submit'
                      className='newsletter_submit_btn trans_300'
                      value='Submit'
                    >
                      subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      {/* )
      )} */}
    </>
  )
}

export default Home

{
  /* <div className='product-item'>
        <div className='product discount product_filter'>
          <div className='product_image'>
            <img src='assets/images/product_1.png' alt='' />
          </div>
          <div className='favorite favorite_left'></div>
          <div className='product_bubble product_bubble_right product_bubble_red d-flex flex-column align-items-center'>
            <span>-$20</span>
          </div>
          <div className='product_info'>
            <h6 className='product_name'>
              <Link to='/'>{product.name}</Link>
            </h6>
            <div className='product_price'>
              $520.00<span>$590.00</span> 
              {product.price}
            </div>
          </div>
        </div>
        <div className='red_button add_to_cart_button'>
          <Link to='/'>add to cart</Link>
        </div>
      </div> */
}
