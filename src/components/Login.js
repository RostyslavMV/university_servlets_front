import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

const Login = props => {
    const qs = require("qs")
    const [user, setUser] = useState(props.initialUser);

    const handleInputChange = event => {
        const {name, value} = event.target
        setUser({...user, [name]: value})
    };

    if(props.loggedIn===true){
        return <Redirect to="/"/>
    }

    const logIn = () => {
        console.log("logIn start")
        console.log(user)
        axios.post('http://localhost:8080/login', {
            username: user.username,
            password: user.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("logIn res")
            sessionStorage.setItem('user',qs.stringify({
                token:res.data.token,
                role:res.data.role,
                firstName:res.data.firstName,
                surname:res.data.surname
            }))
            props.setUser({
                token:res.data.token,
                role:res.data.role,
                firstName:res.data.firstName,
                surname:res.data.surname
            })
            props.setLoggedIn(true)
        }).catch(error => console.log(error))
    }

    return (
        <form className={"form-check"} autoComplete="off">
            <div>
                <label>Username</label>
                <input type="text" value={user.username} name="username" onChange={handleInputChange}/>
            </div>
            <div>
                <label>Password</label>
                <input value={user.password} name="password" type="password" onChange={handleInputChange}/>
            </div>
                <button type="button" onClick={logIn}>Log in</button>
        </form>
    )
}

export default Login;