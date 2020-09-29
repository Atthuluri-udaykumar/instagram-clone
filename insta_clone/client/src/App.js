import React, { useReducer, createContext, useEffect, useContext, useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import "./components/screens/Home"
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom"
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from "./components/screens/Login"
import SignUp from "./components/screens/SignUp"
import Reset from "./components/screens/Reset"

import CreatePost from "./components/screens/CreatePost"
import { initialState, reducer } from "../src/reducer/UserReducer"
import UserProfile from './components/screens/UserProfile';
import ResetPassword from './components/screens/ResetPassword';

export const UseContext = createContext()

function Router() {
  const history = useHistory();
  const { state, dispatch } = useContext(UseContext)

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("user"));
    if (users) {
      dispatch({ type: "USER", payload: users });
    }
  }, [])


  return (
    <Switch>
      <Route exact path="/">
        {state === null ? <Login /> : <Home />}
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <ResetPassword />
      </Route>
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="App">
      <UseContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Router />
        </BrowserRouter>
      </UseContext.Provider>
    </div>
  );
}

export default App;
