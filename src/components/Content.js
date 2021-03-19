import {BrowserRouter, Route} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import React, {useState, useEffect} from 'react';
import NavBar from "./NavBar";
import Lecturer from "./Lecturer";
import Student from "./Student";

function Content() {
    const qs = require("qs")
    const [user, setUser] = useState(qs.parse(sessionStorage.getItem('user')));
    const initialUser = {
        username: '',
        password: '',
        lastName: '',
        firstName: ''
    };
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
            if (user) {
                if (user.token) {
                    if (user.token !== '') {
                        setLoggedIn(true)
                    }
                }
            }
        }, [user]
    )

    const logOut = () => {
        setUser(initialUser)
        setLoggedIn(false)
        sessionStorage.removeItem('user')
    }

    return (
        <div>
            <BrowserRouter>
                <NavBar user={user} loggedIn={loggedIn} logOut={logOut}/>
                <Route path="/register">
                    <Register/>
                </Route>
                <Route path="/login">
                    <Login initialUser={initialUser} setUser={setUser} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
                </Route>
                <Route path={"/"}>
                    {(user.role === "student") &&
                    <div>
                        <Student token={user.token} loggedIn={loggedIn}/>
                    </div>
                    }
                    {(user.role === "lecturer") &&
                    <div>
                        <Lecturer token={user.token}/>
                    </div>
                    }
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default Content;
