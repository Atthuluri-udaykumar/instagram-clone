import React, { useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UseContext } from "../App"

const Navbar = () => {
    const { state, dispatch } = useContext(UseContext)

    const history = useHistory();

    return (
        <div>

            <nav>
                <div className="nav-wrapper red accent-3">

                    <Link to={state !== null ? "/" : "/login"} className="brand-logo">Instagram</Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {state ?
                            <React.Fragment>
                                <li><Link to="/create">Create</Link></li>
                                <li><Link to="/profile">profile</Link></li>
                                <li>
                                    <button
                                        className="waves-effect waves-light btn cyan accent-4"
                                        type="button"
                                        onClick={() => {
                                            localStorage.clear();
                                            history.push("/login")
                                            dispatch({ type: "CLEAR" })
                                        }}
                                    >logout</button>
                                </li>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <li><Link to="/login">signin</Link></li>
                                <li><Link to="/signup">signup</Link></li>
                            </React.Fragment>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

