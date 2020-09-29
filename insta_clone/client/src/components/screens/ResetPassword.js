import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useState } from 'react'
import Axios from 'axios'
import M from "materialize-css"

const ResetPassword = () => {
    const [password, setpassword] = useState("")
    const history = useHistory();
    const { token } = useParams()
    console.log(token);

    const handleSubmit = (e) => {

        e.preventDefault();
        Axios.post("http://localhost:5000/user/newPassword", { password, token })
            .then((res) => {
                console.log(res.data)
                if (res.data.error) {
                    M.toast({ html: res.data.error, classes: "red accent-3 rounded" })
                } else {
                    M.toast({ html: res.data.msg, classes: "green accent-3" })
                    history.push("/login")
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="login-form col-md-6">
            <div className="card form-card">
                <h1>Instagram</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="validate"
                            value={password}
                            onChange={e => setpassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="waves-effect waves-light btn red accent-3"
                        type="submit"
                        onClick={handleSubmit}
                    >Update Password</button>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword
