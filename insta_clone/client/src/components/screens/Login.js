import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useState } from 'react'
import Axios from 'axios'
import M from "materialize-css"

import { UseContext } from "../../App"

const initialValue = {
    email: "",
    password: ""
}

const Login = () => {
    const { state, dispatch } = useContext(UseContext)
    const [values, setvalues] = useState(initialValue)
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target
        setvalues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5000/user/signin", values)
            .then((res) => {
                console.log(res.data)
                if (res.data.error) {
                    M.toast({ html: res.data.error, classes: "red accent-3 rounded" })
                } else {
                    localStorage.setItem("jwt", res.data.token)
                    localStorage.setItem("user", JSON.stringify(res.data.user))
                    dispatch({ type: "USER", payload: res.data.user })
                    M.toast({ html: res.data.msg, classes: "green accent-3" })
                    history.push("/")
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
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="validate"
                            value={values.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="validate"
                            value={values.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="waves-effect waves-light btn red accent-3"
                        type="submit"
                        onClick={handleSubmit}
                    >login</button>
                </form>
                <div className='float-right'>
                    <Link to="/reset" className="right login_link">Forgert password? </Link> &nbsp;&nbsp;
                    <Link to="/signup" className="right login_link">Do you have an account? </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
