import { useContext, useEffect, useState } from "react"
import axiosInstance from "../helpers/axiosInstance"
import { GlobalContext } from "../context/Provider"
import { useHistory } from "react-router-dom"
import Header from "./Header"
import { Dimmer, Loader } from "semantic-ui-react"

function PurchasesPage() {
  const [purchaseDeatils, setPurchaseDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const { authState, globalState } = useContext(GlobalContext)
  const userId = globalState?.user?.userId
  const getAllPurchases = async () => {
    setLoading(true)
    axiosInstance()
      .get(`/users/${userId}/orders`)
      .then((response) => {
        console.log("response.data", response.data)
        setPurchaseDetails(response.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      history.push("/login")
    } else {
      getAllPurchases()
    }
  }, [])

  return (
    <div>
      <Header />
      <br></br>
      {loading ? (
        <div className='container' style={{ marginTop: "250px" }}>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        <div class='container' style={{ marginTop: "130px" }}>
          <h1>My Purchases</h1>
          <br></br>
          <div class='row'>
            <div class='col-12'>
              <table class='table table-image'>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Order ID</th>
                    <th scope='col'>Image</th>
                    <th scope='col'>Product Name</th>
                    <th scope='col'>Price</th>
                    <th scope='col'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseDeatils.map((singlePurchase) => {
                    return (
                      <tr>
                        <th scope='row'>
                          {singlePurchase.createdOn.slice(0, 10)}
                        </th>
                        <td>{singlePurchase._id}</td>
                        <td class='w-25'>
                          <img
                            //   src={singlePurchase.productImage}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null // prevents looping
                              currentTarget.src =
                                "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                            }}
                            src={
                              singlePurchase.productImage
                                ? singlePurchase.productImage
                                : "https://justbakedcake.com/wp-content/uploads/2020/09/Product_Image_Placeholder.jpg"
                            }
                            class='img-fluid img-thumbnail'
                            alt='Product Image'
                            style={{ width: "50px", height: "50px" }}
                          ></img>
                        </td>
                        <td>{singlePurchase.productName}</td>
                        <td>{singlePurchase.price}</td>
                        <td>{singlePurchase.quantity}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchasesPage
