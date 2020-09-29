import React, { useEffect, useState, useContext } from 'react'
import Axios from 'axios'

import { UseContext } from "../../App"

const Profile = () => {
    const { state, dispatch } = useContext(UseContext)
    const [posts, setposts] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:5000/mypost", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {
            setposts(res.data.posts)
        })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="container my-5">
            <div className="row" style={{ borderBottom: "2px solid black", padding: "20px" }}>
                <div className="col-md-5 text-center">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        style={{ height: "160px", width: "160px", borderRadius: "50%" }}
                        alt="your posts" />
                </div>
                <div className="col-md-7 text-center">
                    <h1>{state === null ? null : state.name}</h1>
                    <p className="followers"><span>{posts.length}</span>&nbsp;posts &nbsp;&nbsp;&nbsp; <span>40</span>&nbsp;following &nbsp;&nbsp;&nbsp;<span>40</span>&nbsp;followers</p>
                </div>
            </div>

            <div className="img_gallary">
                {posts.map(post => {
                    return (
                        <React.Fragment key={post._id}>
                            <img src={post.photo}
                                style={{ height: "250px", width: "250px" }}
                                alt="your posts" />
                        </React.Fragment>
                    )
                })}

            </div>
        </div>
    )
}

export default Profile
