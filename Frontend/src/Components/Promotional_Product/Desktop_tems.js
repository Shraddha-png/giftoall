import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";

import Rating from "../Ratings";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, desktopitems: action.payload, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function DesktopItem() {
    //    ####### Add to Cart######
    const [{ loading, error, desktopitems }, dispatch] = useReducer(reducer, {
        desktopitems: [],
        loading: true,
        error: '',
    });



    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/desktopitems');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {/* ########## Add Product ########## */}
            <div className="container-fluid mt-5">
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox varient="danger">{error}</MessageBox>
                ) : (
                    <div className="row ">
                        {desktopitems.map((desktopitem) => (
                            <div className="col-md-3 mb-3" key={desktopitem.slug}>
                                <div className="frostedMug card cardhover">
                                    <Link to={`/desktopitem/${desktopitem.slug}`}>
                                        <img src={desktopitem.image} className="card-img-top px-5" alt={desktopitem.name} />
                                    </Link>
                                    <div className="card-body">
                                        <Link to={`/desktopitem/${desktopitem.slug}`} className="txtdco">
                                            <p className="card-title">{desktopitem.name}</p>
                                        </Link>
                                        <Rating rating={desktopitem.rating} numReviews={desktopitem.numReviews} />

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
export default DesktopItem;