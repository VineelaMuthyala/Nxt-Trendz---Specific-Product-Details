import {Component} from 'react'
import Cookies from 'js-cookie'
import {Loader} from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusValues = {
  loading: 'LOADING',
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    selectedProductDetails: '',
    similarProductsList: [],
    btnCount: 1,
    apiStatus: apiStatusValues.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  onClickDecButton = () => {
    const {btnCount} = this.state
    if (btnCount > 1) {
      this.setState(prevState => ({btnCount: prevState.btnCount - 1}))
    }
  }

  onClickIncButton = () => {
    this.setState(prevState => ({btnCount: prevState.btnCount + 1}))
  }

  getUpdatedData = data => {
    const updatedData = {
      id: data.id,
      title: data.title,
      brand: data.brand,
      imageUrl: data.image_url,
      totalReviews: data.total_reviews,
      rating: data.rating,
      availability: data.availability,

      price: data.price,
      description: data.description,
    }
    return updatedData
  }

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, option)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedDataSelectedItem = this.getUpdatedData(fetchedData)
      const similarProducts = fetchedData.similar_products
      const upDatedDataSimilarProduct = similarProducts.map(eachItem =>
        this.getUpdatedData(eachItem),
      )

      this.setState({
        selectedProductDetails: updatedDataSelectedItem,
        similarProductsList: upDatedDataSimilarProduct,
        apiStatus: apiStatusValues.success,
      })
    } else {
      this.setState({apiStatus: apiStatusValues.failure})
    }
  }

  renderFailure = () => (
    <div className="failure-page-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1 className="failure-page-text">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSuccessfully = () => {
    const {selectedProductDetails, similarProductsList, btnCount} = this.state
    const {
      title,
      brand,
      imageUrl,
      rating,
      availability,
      totalReviews,
      description,
      price,
    } = selectedProductDetails

    return (
      <>
        <div className="product-item-details-container">
          <img className="selected-image" alt="product" src={imageUrl} />
          <div className="item-details-text">
            <h1 className="item-details-heading">{title}</h1>
            <p className="item-details-price">Rs {price}/-</p>
            <div className="item-details-rating-review">
              <div className="item-details-rating-container">
                <p className="item-rating">{rating}</p>
                <img
                  className="star"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <div className="item-review-container">
                <p className="item-review">{totalReviews}</p>
                <p className="review-text">Review</p>
              </div>
            </div>
            <p className="item-description">{description}</p>
            <p className="title-text">Available: {availability}</p>
            <p className="title-text">Brand: {brand}</p>
            <hr />
            <div className="buttons-container">
              <button
                className="inc-dec-button"
                type="button"
                onClick={this.onClickDecButton}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count-text">{btnCount}</p>
              <button
                className="inc-dec-button"
                type="button"
                onClick={this.onClickIncButton}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul>
          {similarProductsList.map(eachItem => (
            <SimilarProductItem
              key={eachItem.id}
              similarProductsDetails={eachItem}
            />
          ))}
        </ul>
      </>
    )
  }

  renderThePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusValues.inProgress:
        return this.renderLoading()
      case apiStatusValues.success:
        return this.renderSuccessfully()
      case apiStatusValues.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        <>{this.renderThePage()}</>
      </div>
    )
  }
}
export default ProductItemDetails
