import React, { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../context/Provider"
import Header from "./Header"
import countries from "../utils/countries.js"
import axiosInstance from "../helpers/axiosInstance"
import { useHistory } from "react-router"
import { Dimmer, Loader } from "semantic-ui-react"
import { baseURL } from "../helpers/axiosInstance"
import axios from "axios"

const ProfilePage = () => {
  const { authState, globalState, globalDispatch } = useContext(GlobalContext)
  console.log("profile", globalState)
  const userDetails = globalState?.user
  const [editUser, setEditUser] = useState(userDetails)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const userId = globalState?.user?.userId
  const getUserDetails = async () => {
    console.log("asas" + userId)
    axiosInstance()
      .get(`/users/${userId}/profile`)
      .then((response) => {
        if (response && response.data) {
          console.log("RES" + JSON.stringify(response.data))
          setEditUser({
            username: response.data.username,
            imageUrl: response.data.imageUrl,
            dob: response.data.dob,
            gender: response.data.gender,
            address: response.data.address,
            city: response.data.city,
            state: response.data.state,
            country: response.data.country,
            about: response.data.about,
            email: response.data.email,
            phoneNo: response.data.phoneNo,
          })

          setLoading(false)
        } else {
          console.log("Error Getting Response from get User API")
        }
      })
      .catch((error) => {
        console.log("Error Getting Response from get User API")
      })
  }

  const handleInputChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    })
    // console.log(editUder)
    // globalDispatch({
    //   type: "EDIT_USER",
    //   payload: editUder,
    // })
  }

  useEffect(() => {
    setLoading(true)
    getUserDetails()
  }, [])

  const handleRadio = (e) => {
    setEditUser({
      ...userDetails,
      gender: e.target.value,
    })
  }

  const postuserData = async () => {
    axiosInstance()
      .put(`/users/${userId}/profile`, editUser)
      .then((response) => {
        if (response && response.data) {
          console.log("update profile successful")
          history.push("/favorites")
        } else {
          console.log("error posting data to API")
        }
        globalDispatch({
          type: "SET_USER",
          payload: editUser,
        })
      })
      .catch((error) => {
        console.log("error posting data to API")
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
        setEditUser({
          ...editUser,
          imageUrl: response.data.imageUrl,
        })
        console.log("edit user aftter response", editUser)
      })
      .catch((error) => {
        console.log("error while uploading", error)
        setEditUser({
          ...editUser,
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0550/2595/9111/products/placeholder-images-image_large_fdf08b50-ae9b-476d-bce2-aa57319b6b67_600x.png?v=1634637556",
        })
      })
  }

  // const handleEditShopSubmit = (e) => {

  // }

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
        editUser && (
          <div className='container' style={{ marginTop: "180px" }}>
            <h2>Your Public Profile</h2>
            <p>Everything on this page can be seen by anyone.</p>
            <div class='container px-4 mt-4'>
              <hr class='mt-0 mb-4' />
              <div class='row'>
                <div class='col-xl-2'>
                  <div class='card mb-4 mb-xl-0'>
                    <div class='card-header'>Profile Picture</div>
                    <div class='card-body text-center'>
                      <img
                        class='img-account-profile rounded-circle mb-2'
                        src={
                          editUser?.imageUrl
                            ? editUser.imageUrl
                            : "https://global-uploads.webflow.com/5e4627609401e01182af1cce/5eb13bfdb4659efea4f8dace_profile-dummy.png"
                        }
                        width='100'
                        height='100'
                        alt=''
                      />
                      <div class='small font-italic text-muted mb-4'>
                        JPG or PNG no larger than 1 MB
                      </div>
                      <button
                        class='btn btn-outline-dark btn-round'
                        data-toggle='modal'
                        data-target='#editShopModal'
                      >
                        Upload new image
                      </button>
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
                              <h5 class='modal-title' id='editShopModalLabel'>
                                <i className='fa fa-plus'></i> Upload new image
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
                                  <label class='form-label' for='customFile'>
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
                                // onClick={handleEditShopSubmit}
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
                <div class='col-xl-10'>
                  <div class='card mb-4'>
                    <div class='card-header'>Account Details</div>
                    <div class='card-body'>
                      <form>
                        {/* <div class="mb-3">
                            <label class="small mb-1" for="inputUsername">Username (how your name will appear to other users on the site)</label>
                            <input class="form-control" id="inputUsername" type="text" placeholder="Enter your username" />
                        </div> */}
                        <div class='row gx-3 mb-3'>
                          <div class='col-md-4'>
                            <label class='mb-1' for='username'>
                              Full name
                            </label>
                            <input
                              class='form-control'
                              id='username'
                              type='text'
                              name='username'
                              placeholder='Enter your full name'
                              value={editUser?.username}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div class='col-md-4'>
                            <label class=' mb-1' for='email'>
                              Email address
                            </label>
                            <input
                              class='form-control'
                              id='email'
                              type='email'
                              name='email'
                              placeholder='Enter your email address'
                              value={editUser?.email}
                              disabled
                              onChange={handleInputChange}
                            />
                          </div>
                          <div class='col-md-4'>
                            <label class='mb-1' for='phoneNo'>
                              Phone number
                            </label>
                            <input
                              class='form-control'
                              id='phoneNo'
                              name='phoneNo'
                              type='text'
                              placeholder='Enter your phone number'
                              value={editUser?.phoneNo}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div class='row gx-3 mb-3'>
                          <div class='col-md-4'>
                            <label class='mb-1' for='city'>
                              City
                            </label>
                            <input
                              class='form-control'
                              id='city'
                              type='text'
                              name='city'
                              placeholder='Enter your City'
                              value={editUser?.city}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div class='col-md-4'>
                            <label class='mb-1' for='state'>
                              State
                            </label>
                            <input
                              class='form-control'
                              id='state'
                              type='text'
                              name='state'
                              placeholder='Enter your State'
                              value={editUser?.state}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div class='col-md-4'>
                            <label class='mb-1' for='country'>
                              Country
                            </label>
                            <select
                              id='country'
                              class='form-control'
                              name='country'
                              value={editUser?.country}
                              onChange={handleInputChange}
                            >
                              <option disabled selected>
                                Choose Country
                              </option>
                              {countries &&
                                countries.map((country) => {
                                  return (
                                    <option value={country.name}>
                                      {country.name}
                                    </option>
                                  )
                                })}
                            </select>
                          </div>
                        </div>
                        <div class='row gx-3 mb-3'>
                          <div class='col-md-4'>
                            <label class='mb-1' for='address'>
                              Address
                            </label>
                            <input
                              type='text'
                              class='form-control'
                              id='address'
                              name='address'
                              placeholder='Enter your Address'
                              value={editUser?.address}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div class='col-md-4'>
                            <label class='mb-1' for='dob'>
                              Birthday
                            </label>
                            <input
                              class='form-control'
                              id='dob'
                              type='date'
                              name='dob'
                              placeholder='Enter your birthday'
                              value={editUser?.dob?.slice(0, 10)}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div class='col-md-4'>
                            <label for='gender'>Gender</label>
                            <div
                              onChange={handleRadio}
                              style={{ marginTop: "5px" }}
                            >
                              <input
                                type='radio'
                                value='Male'
                                name='gender'
                                checked={editUser?.gender === "Male"}
                              />{" "}
                              Male
                              {"      "}
                              <input
                                type='radio'
                                value='Female'
                                name='gender'
                                checked={editUser?.gender === "Female"}
                              />{" "}
                              Female {"  "}
                              {/* <br></br> */}
                              <input
                                type='radio'
                                value='Other'
                                name='gender'
                                checked={editUser?.gender === "Other"}
                              />
                              {"      "}
                              Other
                            </div>
                          </div>
                        </div>
                        <br />
                        <button
                          class='btn btn-dark float-right'
                          type='button'
                          onClick={postuserData}
                        >
                          Save changes
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ProfilePage
