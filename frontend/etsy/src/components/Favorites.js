import React, { useContext, useEffect, useState } from "react"
import { Input } from "semantic-ui-react"
import { GlobalContext } from "../context/Provider"
import { Link } from "react-router-dom"
import Header from "./Header"
import { Dimmer, Loader } from "semantic-ui-react"
import {
  favoritesAction,
  deleteFavoritesAction,
} from "../context/actions/favoritesAction"
const Favorites = () => {
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const {
    user,
    favorites: { data, loading, error },
  } = globalState
  const [query, setQuery] = useState("")
  console.log("user from globalState", user?.userId)
  const userId = user?.userId
  console.log("favorites page", data)
  useEffect(() => {
    window.scrollTo(0, 0)
    favoritesAction(userId)(globalDispatch)
  }, [userId])

  useEffect(() => {
    favoritesAction(userId, query)(globalDispatch)
  }, [query])

  const handleDeleteFav = (id) => {
    console.log("delete id", id)
    deleteFavoritesAction(userId, id)(globalDispatch)
  }

  console.log("Fav data is ", data)

  const productsDiv = data?.favorites.map((favProduct, index) => {
    let pageLink = `/product/${favProduct.product._id}`
    let favProductId = favProduct._id
    return (
      // assets/images/product_1.png
      <div class='col-md-3 col-lg-3 col-sm-6' key={index}>
        <div class='product-grid'>
          <div class='product-image'>
            <Link to={pageLink} class='image'>
              <img
                class='img-1'
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null // prevents looping
                  currentTarget.src =
                    "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                }}
                src={
                  favProduct.product.imageUrl
                    ? favProduct.product.imageUrl
                    : "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                }
                style={{ height: "200px" }}
              />
              <img
                class='img-2'
                src={favProduct.product.imageUrl}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null // prevents looping
                  currentTarget.src =
                    "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                }}
              />
            </Link>
            <ul class='product-links'>
              <li>
                <button
                  className='btn btn-sm'
                  onClick={() => handleDeleteFav(favProductId)}
                >
                  <i class='fa fa-heart color-etsy'></i>
                </button>
              </li>
              <li>
                <Link className='btn btn-sm btn-icon-link' to='/'>
                  <i class='fa fa-shopping-cart'></i>
                </Link>
              </li>
            </ul>
            <Link to={pageLink} class='product-view'>
              <i class='fa fa-search'></i>
            </Link>
          </div>
          <div class='product-content'>
            <ul class='rating'>
              <li class='fa fa-star'></li>
              <li class='fa fa-star'></li>
              <li class='fa fa-star'></li>
              <li class='fa fa-star'></li>
              <li class='fa fa-star disable'></li>
              <li class='disable'>(1 reviews)</li>
            </ul>
            <div className='row'>
              <div className='col-10'>
                <h3 class='title'>
                  <Link to={pageLink}>{favProduct.product.name}</Link>
                </h3>
                <div class='price'>${favProduct.product.price}</div>
              </div>
              {/* <div className='col-2' style={{ paddingLeft: "0px" }}>
                <button
                  class='btn btn-danger'
                  onClick={handleDeleteFav(favProductId)}
                >
                  <i className='fa fa-trash-o'></i>{" "}
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div>
      <Header />

      <div class='container profile-page' style={{ marginTop: "130px" }}>
        <div class='row'>
          <div class='col-xl-6 col-lg-7 col-md-12'>
            <div class='card profile-header'>
              <div class='body'>
                <div class='row'>
                  <div class='col-lg-4 col-md-4 col-12'>
                    <div class='profile-image float-md-right'>
                      {" "}
                      <img
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null // prevents looping
                          currentTarget.src =
                            "https://global-uploads.webflow.com/5e4627609401e01182af1cce/5eb13bfdb4659efea4f8dace_profile-dummy.png"
                        }}
                        src={
                          user?.imageUrl
                            ? user.imageUrl
                            : "https://global-uploads.webflow.com/5e4627609401e01182af1cce/5eb13bfdb4659efea4f8dace_profile-dummy.png"
                        }
                        style={{ height: "130px", width: "130px" }}
                        alt=''
                      />{" "}
                    </div>
                  </div>
                  <div class='col-lg-8 col-md-8 col-12'>
                    {/* <br /> */}
                    <h3 class='mt-2 m-b-0'>{user.username}</h3>
                    <span class='job_post'>0 Followers | </span>
                    <span class='job_post'>0 Following</span>
                    <br /> <br />
                    <div>
                      <Link
                        to='/editprofile'
                        class='btn btn-outline-dark btn-round'
                      >
                        <i className='fa fa-pencil'></i> Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='row'>
          <div class='col-xl-8 col-lg-8 col-md-8'>
            <h4 class='m-t-0 m-b-0'>Favourites</h4>
          </div>
          <div class='col-xl-4 col-lg-4 col-md-4 float-right'>
            <div class='input-group rounded float-right'>
              <Input
                icon={{ name: "search", link: true }}
                placeholder='Search...'
                style={{ width: "600px" }}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" /> */}
              {/* <span class="input-group-text border-0" id="search-addon">
                            <i class="fa fa-search fa-2x"></i>
                        </span> */}
            </div>
          </div>
        </div>
        {loading ? (
          <div className='container' style={{ marginTop: "250px" }}>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </div>
        ) : (
          data?.favorites && (
            <div className='row'>
              {productsDiv} <br /> <br />
            </div>
          )
        )}
        <br /> <br /> <br />
      </div>
    </div>
  )
}

export default Favorites
