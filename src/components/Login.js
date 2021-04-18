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

    if (props.loggedIn === true) {
        return <Redirect to="/"/>
    }

    const getUserInfo = (token) => {
        axios.get('http://localhost:8180/user', {
            headers: {
                'Authorization': 'bearer ' + token
            }
        }).then(resp => {
            sessionStorage.setItem('user', qs.stringify({
                role: resp.data.role,
                firstName: resp.data.firstName,
                surname: resp.data.surname,
                token: token
            }))
            props.setUser({
                role: resp.data.role,
                firstName: resp.data.firstName,
                surname: resp.data.surname,
                token: token
            })
        })
    }

    const logIn = () => {
        console.log("logIn start")
        console.log(user)
        axios.post('http://localhost:8080/auth/realms/University/protocol/openid-connect/token', qs.stringify({
            client_id: "university-app",
            username: user.username,
            password: user.password,
            grant_type: "password",
            client_secret: "c63c0bb0-bcf5-47b2-851e-0fb17550340f"
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            console.log("logIn res")
            getUserInfo(res.data.access_token)
            props.setLoggedIn(true)
            console.log(res.data.access_token)
            console.log(user)
        }).catch(error => console.log(error))
    }

    return (
        <form className={"form-check"} autoComplete="off">
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                    <input className="form-control" placeholder={"Username"} type="text" value={user.username}
                           name="username" onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input className="form-control" placeholder={"Password"} value={user.password} name="password"
                           type="password" onChange={handleInputChange}/>
                </div>
            </div>
            <button className={"btn btn-primary"} type="button" onClick={logIn}>Log in</button>
        </form>
    )
}

export default Login;