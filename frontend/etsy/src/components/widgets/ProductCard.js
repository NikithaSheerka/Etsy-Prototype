import React from "react"
import { Link } from "react-router-dom"
import { BsSuitHeartFill } from "react-icons/bs"
import { CgShoppingCart } from "react-icons/cg"
const ProductCard = ({
  product,
  index,
  pageLink,
  handleFavProduct,
  addToCart,
}) => {
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
                product.imageUrl
                  ? product.imageUrl
                  : "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
              }
              style={{ height: "200px" }}
            />
            <img
              class='img-2'
              src={product.imageUrl}
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
                className='btn btn-sm btn-icon-link'
                style={{ fontSize: "16px", color: "black" }}
                onClick={() => handleFavProduct(product._id)}
              >
                <BsSuitHeartFill style={{ fontSize: "18px" }} />
                {/* <i class='fa fa-heart-o'></i> */}
              </button>
            </li>
            <li>
              {/* <Link to="/cart"> */}
              <button
                className='btn btn-sm btn-icon-link'
                onClick={() => addToCart(product._id)}
              >
                <CgShoppingCart style={{ fontSize: "18px" }} />
              </button>
              {/* </Link> */}
            </li>
          </ul>
          <Link to={pageLink} class='product-view'>
            <i class='fa fa-search'></i>
          </Link>
        </div>
        <div class='product-content'>
          {product.quantity > 0 ? null : (
            <span class='badge badge-secondary'>Out of Stock</span>
          )}
          {/* <ul class='rating'>
            <li class='fa fa-star'></li>
            <li class='fa fa-star'></li>
            <li class='fa fa-star'></li>
            <li class='fa fa-star'></li>
            <li class='fa fa-star disable'></li>
            <li class='disable'>(1 reviews)</li>
          </ul> */}
          <h3 class='title'>
            <Link to={pageLink}>{product.name}</Link>
          </h3>
          <div class='price'>${product.price}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
