import React from 'react'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import Axios from 'axios'
import M from "materialize-css"


const initialValue = {
    email: ""
}

const Reset = () => {
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
        Axios.post("http://localhost:5000/user/reset", values)
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
                    <button
                        className="waves-effect waves-light btn red accent-3"
                        type="submit"
                        onClick={handleSubmit}
                    >Reset</button>
                </form>

            </div>
        </div>
    )
}

export default Reset
