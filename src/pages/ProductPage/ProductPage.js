import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import './ProductPageStyle.css';
import {connect} from "react-redux";
import {addItemAction, removeItemAction} from "../../store/cart/cartActions";
import {client} from "../../index";
import {gql} from "@apollo/client";

class ProductPage extends Component {

    componentDidMount() {
        const id = this.props.match.params.id;
        this.getSingleProduct(id)
    }

    getSingleProduct(id) {
        client.query({
            query : gql`
            query {
                product(id: "${id}") {
                  id
                  name
                  inStock
                  brand
                  gallery
                  description
                  attributes {
                    name
                    id
                    type
                    items {
                      id
                      value
                      displayValue
                    }
                  }
                  prices {
                    currency {
                        label
                        symbol
                    }
                    amount
                  }
                }
            }`
        }).then((res) => {
            this.setState({
                product: res?.data?.product,
                mainImage: res?.data?.product.gallery[0]
            })
        })
    }

    render() {
        const currency = this.props.currency.currency;
        const product = this.state?.product;
        const images = [];
        const description = product?.description.replace(new RegExp('<[^>]*>', 'g'), '');
        const res = description?.slice(0,250);
        let mainImage = this.state?.mainImage;
        for(let i=0;i<4;i++){
            images.push(<img key={i} onClick={() => this.setState({mainImage: product?.gallery[i]})} src={product?.gallery[i]} alt=""/>)
        }
        return(
            <div className="parent-cont">
                <div className="product-page-grid">
                    <div className="product-pictures">
                        <div className="more-pics">
                            {images}
                        </div>
                        <div className="main-pic">
                            <img src={mainImage} alt=""/>
                        </div>
                    </div>
                    <div className="product-description">
                        <div>
                            <h1 style={{width: "70%",fontWeight:"600"}}>{product?.name.split(" ",1)}<span></span></h1>
                            <h1 style={{width: "70%",fontWeight:"400",marginTop:"-15px"}}>{product?.name.substr(product?.name.indexOf(" ") +1)}<span></span></h1>
                        </div>
                        <div>
                            <label>Size:</label>
                        </div>
                        <div style={{paddingTop:"20px"}}>
                            <label><strong>Price: </strong></label>
                                <h2>
                                    {currency === "$" ? product?.prices[0].currency.symbol : currency === "£" ? product?.prices[1].currency.symbol : product?.prices[3].currency.symbol }
                                    {currency === "$" ? product?.prices[0].amount : currency === "£" ? product?.prices[1].amount : product?.prices[3].amount}
                                </h2>
                        </div>
                        <div>
                            <button className="add-to-cart-btn"onClick={() => this.props.addItemAction(product)}>Add To Cart</button>
                        </div>
                        <div className="product-paragraph">
                            {description?.length >= 250 && !this.state?.showFullDesc ?
                                <p>{res}<span onClick={() => this.setState({showFullDesc: true})}>...more</span></p>
                                :
                                <p>{description} {this.state?.showFullDesc ? <span onClick={() => this.setState({showFullDesc: false})}>...less</span> : null}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        cartReducer: state.cartReducer,
        currency: state.currencyReducer
    }
}

const mapDispatchToProps = () => {
    return{
        addItemAction,
        removeItemAction,

    }
}

export default connect(mapStateToProps,mapDispatchToProps()) (withRouter(ProductPage));