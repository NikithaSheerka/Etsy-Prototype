import React, { useContext, useEffect, useState } from "react"
import Header from "./Header"
import { GlobalContext } from "../context/Provider"
import { useHistory, useParams } from "react-router"
import { shopAction } from "../context/actions/shopAction"
import { Dimmer, Loader } from "semantic-ui-react"
import axiosInstance from "../helpers/axiosInstance"
import axios from "axios"
import ShopProductCard from "./widgets/ShopProductCard"
import { Modal as BtModal, Button as BtButton } from "react-bootstrap"
import EditForm from "./widgets/EditForm"
import { baseURL } from "../helpers/axiosInstance"

const ShopHome = () => {
  const history = useHistory()
  const { userId, shopId } = useParams()
  const [isOwner, setIsOwner] = useState(null)
  const shopData = {
    shopIds: [shopId],
  }
  const [addItemData, setAddItemData] = useState({})
  const [shopProducts, setShopProducts] = useState([])
  const [submitError, setSubmitError] = useState("")
  const [addedItem, setAddedItem] = useState(false)
  const [editedItem, setEditedItem] = useState(false)
  const [editedShopFlag, setEditedShopFlag] = useState(false)
  const [categories, setCategories] = useState([])
  const [closeModal, setCloseModal] = useState(false)
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [editItemProduct, setEditItemProduct] = useState("")
  const [editProductData, setEditProductData] = useState({})
  const [editShopImage, setEditShopImage] = useState({})
  const [newCatShow, setNewCatShow] = useState(false)
  const [newCatValue, setNewCatValue] = useState("")
  const { globalDispatch, globalState } = useContext(GlobalContext)
  const shopFromState = globalState?.shop?.data?.createdBy
  const {
    shop: { data, loading, error },
    user,
  } = globalState
  const userDetails = JSON.parse(localStorage.getItem("userDetails"))
  useEffect(() => {
    // getShopProductsAction(userId, shopData)(globalDispatch)
    //  {{host}}/users/{{userId}}/shops/{{shopId}}/products
    shopAction(userId, shopId)(globalDispatch)
    axiosInstance()
      .post(`/users/${userId}/products`, shopData)
      .then((response) => {
        console.log("response from shop products", response.data)
        setShopProducts(response.data.products)
      })
    console.log("data?.createdBy", data?.createdBy)
    console.log("userDetails.userId", userDetails.userId)
    console.log("shopFromState", shopFromState)

    shopAction(userId, shopId)(globalDispatch)
    if (shopFromState === userDetails.userId) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }, [addedItem, editedItem, editedShopFlag])

  useEffect(() => {
    if (shopFromState === userDetails.userId) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  })

  const openBtModal = () => setEditModalIsOpen(true)
  const closeBtModal = () => setEditModalIsOpen(false)

  const handleEdit = (product) => {
    // users/${userId}/products/${productId}
    console.log("product", product)
    axiosInstance()
      .get(`/users/${userId}/shops/${shopId}/categories`)
      .then((response) => {
        console.log("response for categories", response.data)
        setCategories(response.data.categories)
      })
      .catch((error) => {
        console.log("error", error)
        setSubmitError("Could not get categories. Please try again later.")
      })
    openBtModal()
    console.log(editModalIsOpen)
    setEditItemProduct(product)
  }

  const pullEditItemData = (data) => {
    setEditProductData(data)
  }

  const handleEditItemSubmit = (e) => {
    e.preventDefault()
    console.log("editProductData", editProductData)
    setSubmitError("")
    axiosInstance()
      .put(`/users/${userId}/products/${editItemProduct._id}`, editProductData)
      .then((response) => {
        console.log("response", response.data)
        setEditedItem((prevState) => !prevState)
        closeBtModal()
      })
      .catch((error) => {
        console.log("error", error)
        setSubmitError("Could not update item. Please try again later.")
      })
  }

  const handleAddItemInputChange = async (e) => {
    setAddItemData({
      ...addItemData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddNewItemBtnClick = () => {
    // {{host}}/users/{{userId}}/shops/{{shopId}}/categories
    axiosInstance()
      .get(`/users/${userId}/shops/${shopId}/categories`)
      .then((response) => {
        console.log("response for categories", response.data)
        setCategories(response.data.categories)
      })
      .catch((error) => {
        console.log("error", error)
        setSubmitError("Could not get categories. Please try again later.")
      })
  }

  const handleAddItemUpload = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("myImage", e.target.files[0])
    console.log(e.target.files[0])
    console.log(formData)
    axios({
      method: "post",
      url: `${baseURL}/upload`,
      data: formData,
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
      .then((response) => {
        console.log("response from upload", response.data)
        setAddItemData({
          ...addItemData,
          imageUrl: response.data.imageUrl,
        })
      })
      .catch((error) => {
        console.log("error while uploading", error)
        setAddItemData({
          ...addItemData,
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0550/2595/9111/products/placeholder-images-image_large_fdf08b50-ae9b-476d-bce2-aa57319b6b67_600x.png?v=1634637556",
        })
      })
  }

  const handleAddItemSubmit = (e) => {
    e.preventDefault()
    console.log("addItemData", addItemData)
    setSubmitError(false)
    const { name, description, price, imageUrl, quantity, categoryId } =
      addItemData
    if (name && description && price && imageUrl && quantity && categoryId) {
      //  {{host}}/users/{{userId}}/shops/{{shopId}}/products
      axiosInstance()
        .post(`/users/${userId}/shops/${shopId}/products`, addItemData)
        .then((response) => {
          console.log("response from shop products", response.data)
          // setShopProducts(response.data.products)
          setAddedItem((prevState) => !prevState)
          setAddItemData({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            quantity: "",
            categoryId: "",
          })
        })
        .catch((error) => {
          console.log("error while uploading", error)
        })
      setCloseModal(true)
    } else {
      setSubmitError("Please fill all the fields.")
    }
  }

  const handleEditShopSubmit = (e) => {
    e.preventDefault()
    console.log("editShop", editShopImage)
    setSubmitError("")
    axiosInstance()
      .put(`/users/${userId}/shops/${shopId}`, editShopImage)
      .then((response) => {
        console.log("response", response.data)
        setEditedShopFlag((prevState) => !prevState)
        closeBtModal()
      })
      .catch((error) => {
        console.log("error", error)
        setSubmitError("Could not update item. Please try again later.")
      })
  }

  const handleEditShopImageUpload = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("myImage", e.target.files[0])
    console.log(e.target.files[0])
    console.log(formData)
    axios({
      method: "post",
      url: `${baseURL}/upload`,
      data: formData,
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
      .then((response) => {
        console.log("response from upload", response.data)
        setEditShopImage({
          imageUrl: response.data.imageUrl,
        })
      })
      .catch((error) => {
        console.log("error while uploading", error)
        setEditShopImage({
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0550/2595/9111/products/placeholder-images-image_large_fdf08b50-ae9b-476d-bce2-aa57319b6b67_600x.png?v=1634637556",
        })
      })
  }

  const productsDiv = shopProducts?.map((product, index) => {
    let pageLink = `/product/${product._id}`
    return (
      <ShopProductCard
        product={product}
        key={index}
        pageLink={pageLink}
        handleEdit={handleEdit}
        isOwner={isOwner}
      />
    )
  })

  const showNewCatInput = () => {
    setNewCatShow(true)
  }

  const hideNewCatInput = () => {
    setNewCatShow(false)
  }

  const handleNewCat = (e) => {
    setNewCatValue(e.target.value)
  }
  const newCat = {
    name: newCatValue,
  }
  const postNewCatData = async () => {
    const response = await axiosInstance().post(
      `https://etsykrishnasai.herokuapp.com/users/${userId}/shops/${shopId}/categories`,
      newCat
    )
    console.log("//", baseURL)
    console.log(
      "//////////",
      `https://etsykrishnasai.herokuapp.com/users/${userId}/shops/${shopId}/categories`
    )
    if (response && response.data) {
      const response = await axiosInstance().get(
        `https://etsykrishnasai.herokuapp.com/users/${userId}/shops/${shopId}/categories`
      )
      if (response.data && response) {
        setCategories(response.data.categories)
      } else {
        console.log("Error adding new categories")
      }
      hideNewCatInput()
    } else {
      console.log("Error Adding New Category")
    }
  }

  return (
    <div>
      <Header />
      {loading ? (
        <div className='container' style={{ marginTop: "250px" }}>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        data && (
          <div className='container' style={{ marginTop: "180px" }}>
            <div className='row'>
              <div className='col-md-8'>
                <div class='card profile-header'>
                  <div class='body'>
                    <div class='row'>
                      <div class='col-lg-4 col-md-4 col-12'>
                        <div class='profile-image float-md-right'>
                          {" "}
                          <img
                            src={data.imageUrl}
                            style={{ width: "150px", height: "150px" }}
                            alt=''
                          />{" "}
                        </div>
                      </div>
                      <div class='col-lg-8 col-md-8 col-12'>
                        {/* <br /> */}
                        <h3 class='mt-2 m-b-0'>{data.name}</h3>
                        <span class='job_post'>
                          {data.totalSalesCount} Sales |{" "}
                        </span>
                        <span class='job_post'> Star Seller</span>
                        <br /> <br />
                        <div>
                          {isOwner && (
                            <button
                              class='btn btn-outline-dark btn-round'
                              data-toggle='modal'
                              data-target='#editShopModal'
                            >
                              <i className='fa fa-pencil'></i> Edit Shop
                            </button>
                          )}
                          <div
                            class='modal fade'
                            id='editShopModal'
                            tabIndex='-1'
                            role='dialog'
                            aria-labelledby='editShopModalLabel'
                            aria-hidden='true'
                          >
                            <div
                              class='modal-dialog modal-dialog-centered'
                              role='document'
                            >
                              <div class='modal-content'>
                                <div class='modal-header'>
                                  <h5
                                    class='modal-title'
                                    id='editShopModalLabel'
                                  >
                                    <i className='fa fa-plus'></i> Edit Shop
                                  </h5>
                                  <button
                                    type='button'
                                    class='close'
                                    data-dismiss='modal'
                                    aria-label='Close'
                                  >
                                    <span aria-hidden='true'>&times;</span>
                                  </button>
                                </div>
                                <div class='modal-body'>
                                  <form>
                                    <div className='form-group'>
                                      <label
                                        class='form-label'
                                        for='customFile'
                                      >
                                        Upload Shop Image
                                      </label>
                                      <input
                                        type='file'
                                        class='form-control'
                                        accept='image/*'
                                        id='customFile'
                                        name='imageUrl'
                                        onChange={handleEditShopImageUpload}
                                      />
                                    </div>
                                  </form>
                                </div>
                                <div class='modal-footer'>
                                  <button
                                    type='button'
                                    class='btn btn-secondary'
                                    data-dismiss='modal'
                                  >
                                    Close
                                  </button>
                                  <button
                                    type='button'
                                    class='btn btn-dark'
                                    onClick={handleEditShopSubmit}
                                    data-dismiss='modal'
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div class='card'>
                  <div class='card-body'>
                    <div class='d-flex flex-column align-items-center text-center'>
                      <img
                        src={
                          data.ownerDetails.imageUrl
                            ? data.ownerDetails.imageUrl
                            : "https://saltadorarchitects.com/images/team/01.jpg"
                        }
                        alt='Admin'
                        class='rounded-circle'
                        width='100'
                        height='100'
                      />
                      <div class='mt-3'>
                        <h3 class='mt-2 m-b-0'>{data.ownerDetails.username}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container' style={{ margin: "30px auto" }}>
              <div className='row'>
                <div className='col-md-10'>
                  <h4>Shop Items</h4>
                </div>
                <div className='col-md-2 float-right'>
                  {isOwner ? (
                    <button
                      className='btn btn-outline-dark w-100'
                      data-toggle='modal'
                      data-target='#addItemModal'
                      onClick={handleAddNewItemBtnClick}
                    >
                      <i className='fa fa-plus'></i> Add New Item
                    </button>
                  ) : null}

                  <div
                    class='modal fade'
                    id='addItemModal'
                    tabIndex='-1'
                    role='dialog'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                  >
                    <div
                      class='modal-dialog modal-dialog-centered'
                      role='document'
                    >
                      <div class='modal-content'>
                        <div class='modal-header'>
                          <h5 class='modal-title' id='exampleModalLabel'>
                            <i className='fa fa-plus'></i> Add New Item
                          </h5>
                          <button
                            type='button'
                            class='close'
                            data-dismiss='modal'
                            aria-label='Close'
                          >
                            <span aria-hidden='true'>&times;</span>
                          </button>
                        </div>
                        <div class='modal-body'>
                          <form onSubmit={(e) => e.preventDefault()}>
                            {submitError && (
                              <div class='alert alert-danger' role='alert'>
                                {submitError}
                              </div>
                            )}
                            <div class='form-group'>
                              <label for='name' class='col-form-label'>
                                Product Name
                              </label>
                              <input
                                type='text'
                                class='form-control'
                                id='name'
                                name='name'
                                onChange={handleAddItemInputChange}
                              />
                            </div>
                            <div class='form-group'>
                              <label for='category'>Category</label>
                              <select
                                id='category'
                                class='form-control'
                                name='categoryId'
                                onChange={handleAddItemInputChange}
                              >
                                <option disabled selected>
                                  Choose Category
                                </option>
                                {categories &&
                                  categories.map((category) => {
                                    return (
                                      <option value={category._id}>
                                        {category.name}
                                      </option>
                                    )
                                  })}
                              </select>
                              <button
                                onClick={showNewCatInput}
                                className='btn btn-link'
                                type='button'
                                style={{ color: "black" }}
                              >
                                <i className='fa fa-plus'></i> Create New
                                Category
                              </button>
                            </div>
                            <div className='row'>
                              <div className='col'>
                                {newCatShow && (
                                  <input
                                    placeholder='Enter New Category'
                                    className='form-control'
                                    type='text'
                                    name='newcat'
                                    value={newCatValue}
                                    onChange={handleNewCat}
                                  ></input>
                                )}
                              </div>

                              <div className='col'>
                                {/* <br></br>
                                      <br></br> */}
                                {newCatShow && (
                                  <button
                                    className='btn btn-sm btn-dark'
                                    onClick={postNewCatData}
                                  >
                                    Save
                                  </button>
                                )}{" "}
                                {"  "}
                                {newCatShow && (
                                  <button
                                    className='btn btn-sm btn-outline-dark'
                                    onClick={hideNewCatInput}
                                  >
                                    Cancel
                                  </button>
                                )}
                                <br />
                              </div>
                            </div>
                            <div class='form-group'>
                              <label class='col-form-label' for='price'>
                                Price (USD)
                              </label>
                              <input
                                type='number'
                                class='form-control'
                                id='price'
                                name='price'
                                onChange={handleAddItemInputChange}
                              />
                            </div>
                            <div class='form-group'>
                              <label for='message-text' class='col-form-label'>
                                Description
                              </label>
                              <textarea
                                class='form-control'
                                name='description'
                                onChange={handleAddItemInputChange}
                              ></textarea>
                            </div>
                            <div class='form-group'>
                              <label
                                for='recipient-name'
                                class='col-form-label'
                              >
                                Quantity Available
                              </label>
                              <input
                                type='number'
                                name='quantity'
                                onChange={handleAddItemInputChange}
                                class='form-control'
                              />
                            </div>
                            <div className='form-group'>
                              <label class='form-label' for='customFile'>
                                Upload Product Image
                              </label>
                              <input
                                type='file'
                                class='form-control'
                                accept='image/*'
                                id='customFile'
                                name='imageUrl'
                                onChange={handleAddItemUpload}
                              />
                            </div>
                          </form>
                        </div>
                        <div class='modal-footer'>
                          <button
                            type='button'
                            class='btn btn-secondary'
                            data-dismiss='modal'
                          >
                            Close
                          </button>
                          <button
                            type='button'
                            class='btn btn-primary'
                            onClick={handleAddItemSubmit}
                            disabled={
                              !addItemData.name ||
                              !addItemData.price ||
                              !addItemData.quantity ||
                              !addItemData.imageUrl ||
                              !addItemData.categoryId ||
                              !addItemData.description
                            }
                            data-dismiss='modal'
                          >
                            Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BtModal show={editModalIsOpen} onHide={closeBtModal}>
                <BtModal.Header closeButton>
                  <BtModal.Title>Edit Item</BtModal.Title>
                </BtModal.Header>
                <BtModal.Body>
                  <EditForm
                    key={editItemProduct._id}
                    // handleEditItemInputChange={handleEditItemInputChange}
                    editItemProduct={editItemProduct}
                    categories={categories}
                    pullEditItemData={pullEditItemData}
                    submitError={submitError}
                  />
                </BtModal.Body>
                <BtModal.Footer>
                  <BtButton variant='secondary' onClick={closeBtModal}>
                    Close
                  </BtButton>
                  <BtButton
                    variant='primary'
                    onClick={handleEditItemSubmit}
                    disabled={
                      !editProductData.name ||
                      !editProductData.price ||
                      !editProductData.quantity ||
                      !editProductData.imageUrl ||
                      !editProductData.categoryId ||
                      !editProductData.description
                    }
                  >
                    {" "}
                    Save Changes
                  </BtButton>
                </BtModal.Footer>
              </BtModal>
              <div className='row'>{productsDiv}</div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ShopHome
