import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios'

import { UseContext } from "../../App"
import { Link } from 'react-router-dom';

const base64Img = require('base64-img');

const Home = () => {
    const [data, setdata] = useState([])
    const { state, dispatch } = useContext(UseContext)

    useEffect(() => {
        Axios.get("http://localhost:5000/getallposts", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {

            setdata(res.data.post)
        }
        )
            .catch(err => console.log(err))
    }, [])

    const onLike = (id) => {

        Axios.put("http://localhost:5000/like", { postId: id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {
            const newData = data.map(item => {
                if (item._id === res.data.result._id) {
                    return res.data.result
                } else {
                    return item
                }
            })
            setdata(newData)

        })
            .catch(err => console.log(err))
    }

    const unLike = (id) => {
        Axios.put("http://localhost:5000/unlike", { postId: id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {
            const newData = data.map(item => {
                if (res.data.result._id === item._id) {
                    return res.data.result
                } else {
                    return item
                }
            })
            setdata(newData);
        }).catch(err => console.log(err))
    }

    const comments = (text, postId) => {
        Axios.put("http://localhost:5000/comment", { text, postId }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => {
                let newData = data.map(item => {
                    if (res.data.result._id === item._id) {
                        return res.data.result
                    } else {
                        return item
                    }
                })
                setdata(newData)
            })
            .catch(err => console.log(err))
    }

    const deletePost = (postId) => {
        Axios.delete(`http://localhost:5000/delete/${postId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(result => {

            const newData = data.filter(item => item._id !== result.data.result._id)
            setdata(newData)
        })
            .catch(err => console.log(err))
    }

    return (
        <div className="container" style={{ width: "70%" }}>

            {data.map((item, index) => {
                return (<div className="card my-4" key={item._id}>
                    <div className="card-content">
                        <div className="d-flex justify-content-between">
                            <Link to={state._id !== item.postedBy._id ? "/profile/" + item.postedBy._id : "/profile"}>  <h5>{item.postedBy.name}</h5></Link>
                            {state._id === item.postedBy._id ? <p onClick={() => deletePost(item._id)}> <i className="material-icons" style={{ cursor: "pointer" }} >delete</i></p> : null}
                        </div>
                        <div className="card-image">
                            <img src={item.photo}
                                style={{ height: "400px" }} alt="profile " />
                        </div>
                        <div className="my-3">
                            <i className="material-icons" style={{ color: "#ff1744" }}>favorite</i>
                            {item.likes.includes(state._id) ? <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => unLike(item._id)}>thumb_down</i> :
                                <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => onLike(item._id)}>thumb_up</i>
                            }
                            <h5>{item.likes.length}</h5>
                            <h5>{item.title}</h5>
                            <p>{item.body}</p>

                            {item.comments.map(com => {
                                return <p><span className="h6">{com.postedBy.name}</span>  :- {com.text}</p>
                            })}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                comments(e.target[0].value, item._id);
                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    )

}

export default Home
