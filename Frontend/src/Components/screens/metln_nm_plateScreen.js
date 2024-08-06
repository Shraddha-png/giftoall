import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRating from "./StarRatingScreen";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { getError } from "../Utiles";
import { Store } from "../Store";
import Metalicplate from "../Custome_Name_Plate/Metallic_Name_Plate";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, metlnmplate: action.payload, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'REVIEW_SUBMITTED':
            return { ...state, metlnmplate: action.payload };
        default:
            return state;
    }
};

function MetlnateScreen() {
    const navigate = useNavigate();
    const { slug } = useParams();

    const [{ loading, error, metlnmplate }, dispatch] = useReducer(reducer, {
        metlnmplate: {},
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/metlnmplates/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                console.error(err);
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, isLoggedIn, userInfo } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === metlnmplate._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/metlnmplates/${metlnmplate._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...metlnmplate, quantity }
        })
        navigate('/cart')
    }

    const buyNowHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === metlnmplate._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/metlnmplates/${metlnmplate._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...metlnmplate, quantity }
        })
        navigate('/shipping')
    }

    // ########PostRevies##############

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const submitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        try {
            const { data } = await axios.post(
                '/api/metlnmplaetreviews',
                {
                    rating: Number(rating),
                    title,
                    comment,
                    metlnmplateId: metlnmplate._id,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            console.log('Review submitted:', data);
            const result = await axios.get(`/api/metlnmplates/slug/${slug}`);
            dispatch({ type: 'REVIEW_SUBMITTED', payload: result.data });
        } catch (error) {
            console.error('Error submitting review:', error.response ? error.response.data.message : error.message);
        }
    };


    const onRatingChange = (newRating) => {
        setRating(newRating);
    };

    return loading ? (
        <LoadingBox />)
        : error ? (
            <MessageBox varient="danger">{error}</MessageBox>
        ) : (
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-md-5">
                        <img className="img-large" src={metlnmplate.image} alt={metlnmplate.name}></img>
                    </div>
                    <div className="col-md-7 box">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <h3>{metlnmplate.name}</h3>
                            </li>
                            <li className="list-group-item inlineclass">
                                <StarRating rating={metlnmplate.rating || 0} onRatingChange={onRatingChange} />
                                <p>Review({metlnmplate.metlnmplaetreviews.length})</p>
                            </li>
                            <li className="list-group-item">
                                Price : {isLoggedIn ? (
                                    <><i className="bi bi-currency-rupee"></i>{metlnmplate.price}</>
                                ) : (
                                    'Login/Register to see Price'
                                )}
                            </li>
                            <li className="list-group-item">
                                Description:
                                <p>At Fine Multiprint Solution, we specialize in crafting custom metal name plates that offer a sophisticated and durable solution for identification and branding needs. Perfect for professional settings, events, and promotional purposes, our metal name plates can be personalized with names, logos, and designs to meet your specific requirements.Our metal name plates are designed to provide a polished and professional appearance, making them ideal for a variety of applications.<br />
                                    <b>Customization Options</b><br />
                                    Personalized Printing: Add individual names, titles, and company logos to each name plate using high-quality engraving or printing techniques. Metal surfaces allow for precise and detailed designs.<br />
                                    Design Flexibility: Customize the shape, size, and layout of the name plates to match your brand or event theme. Options include rectangular, oval, or custom shapes.<br />
                                    Material Choices: Choose from various metals such as aluminum, brass, or stainless steel to create the perfect look and feel for your name plates. Each metal offers a unique finish and durability.<br />
                                    Color Options: Select from a range of finishes, including brushed, polished, or matte. Add color to your designs through printing or enamel fills to match your branding or personal preferences.<br />
                                    <b>Features of Custom Metal Name Plates</b><br />
                                    Durable Construction: Made from high-quality metals to ensure longevity and resistance to wear and tear. Ideal for both indoor and outdoor use.<br />
                                    Secure Attachment: Available with magnetic backings, pins, or other secure attachment methods, ensuring easy and reliable use.<br />
                                    Professional Appearance: The sleek and polished finish of metal provides a sophisticated and timeless look, enhancing the image of your brand or event.<br />
                                    For more information or to place an order, please reach out to us at:<br />
                                    <b> Phone: 9920033112</b><br />
                                    <b> Email: fmprintsolutions@gmail.com</b>
                                </p></li>
                        </ul>
                        <div className="row p-3">
                            <div className="col-md-3">
                                <div className="list-group-item">
                                    <div className="row">
                                        <div className="d-grid">
                                            <button onClick={buyNowHandler} className="btn btn-success">Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="list-group-item">
                                    <div className="d-grid">
                                        <button onClick={addToCartHandler} className="btn btn-primary">Add To Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Created Review */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3 mt-5">
                            <nav className="nav">
                                <a className="btn btn-primary mt-3" aria-current="page" data-bs-toggle="collapse" href="#metlnmplaetreviews" >Write a Review</a>
                            </nav>
                            <div className="collapse" id="metlnmplaetreviews">
                                {userInfo ? (
                                    <form onSubmit={submitReview}>
                                        <div className="mb-3">
                                            <label htmlFor="rating" className="form-label">Rating</label>
                                            <StarRating rating={rating} onRatingChange={onRatingChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Title</label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="form-control"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="comment" className="form-label">Comment</label>
                                            <textarea
                                                id="comment"
                                                className="form-control"
                                                rows="5"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit Review</button>
                                    </form>
                                ) : (
                                    <MessageBox>
                                        Please <a href="/signin">Sign In</a> to write a review
                                    </MessageBox>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h4 className="relatedspro">RELATED PRODUCTS</h4>
                </div>
                <Metalicplate />
                <hr className="mt-1" />
                <div className="container-fluid mt-4">
                    <h4>Customer Reviews</h4>
                    {metlnmplate.metlnmplaetreviews.length === 0 && <p>No reviews yet.</p>}
                    <ul className="list-group">
                        {metlnmplate.metlnmplaetreviews.map((review) => (
                            <li key={review._id} className="list-group-item">
                                <h5>{review.title}</h5>
                                <StarRating rating={review.rating} onRatingChange={() => { }} />
                                <p>{review.comment}</p>
                                <p>By: {review.user.fname}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        );
}

export default MetlnateScreen;