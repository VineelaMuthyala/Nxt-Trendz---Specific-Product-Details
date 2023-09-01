import './index.css'

const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {title, brand, imageUrl, rating, price} = similarProductsDetails
  return (
    <li className="similar-product-container">
      <img
        className="similar-product-image"
        alt="similar product"
        src={imageUrl}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            className="similar-product-star"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
