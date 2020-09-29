import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import M from "materialize-css"

const CreatePost = () => {
    const [title, settitle] = useState("")
    const [body, setbody] = useState("")
    const [photo, setphoto] = useState("")
    const [url, seturl] = useState("")
    const history = useHistory();


    const postDetails = () => {
        const data = new FormData();
        data.append("file", photo)
        data.append("upload_preset", "insta_clone")
        data.append('cloud_name', "dxif90ym7")
        fetch("https://api.cloudinary.com/v1_1/dxif90ym7/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                seturl(data.url)
            }).catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {
        Axios.post("http://localhost:5000/createpost", { title, body, photo: url }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        })
            .then(res => {
                console.log(res.data);
                if (res.data.error) {
                    M.toast({ html: res.data.error, classes: "red accent-3 rounded" })
                } else {
                    M.toast({ html: res.data.msg, classes: "green accent-3" })
                    history.push("/")
                }
            }).catch(err => console.log(err))
    }, [url])



    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="row ">
            <div className="col-md-6 col-11 mx-auto">
                <div className="card my-5 p-5">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="title"
                            name="title"
                            value={title}
                            onChange={e => settitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="body"
                            name="body"
                            value={body}
                            onChange={e => setbody(e.target.value)}
                        />
                        <div className="file-field input-field">
                            <div className="btn teal lighten-2">
                                <span>File</span>
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={e =>
                                        setphoto(e.target.files[0])
                                    }
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="waves-effect waves-light btn red accent-3" type="submit" onClick={postDetails}>submit post</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
