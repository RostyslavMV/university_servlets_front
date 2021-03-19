import React, {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const Register = () => {
    const initialUser = {
        surname: '',
        firstName: '',
        patronymic: '',
        username: '',
        password: '',
        role: 'student'
    };
    const [user, setUser] = useState(initialUser);

    const handleInputChange = event => {
        const {name, value} = event.target
        if (name==='role'){
            console.log(value)
            if (value==='student'){
                console.log("if")
                setUser({...user, [name]: 'lecturer'})
            }
            else{
                setUser({...user, [name]: 'student'})
            }
            return
        }
        console.log(user)
        setUser({...user, [name]: value})
    };

    const register = () => {
        axios.post('http://localhost:8080/user', {
            surname: user.surname,
            firstName: user.firstName,
            patronymic: user.patronymic,
            username: user.username,
            password: user.password,
            role: user.role
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => (
            console.log(resp.data)
        )).catch(error => console.log(error))
    }

    return (
        <form className={"form-check"} autoComplete="off">
            <div>
                <label>Surname</label>
                <input type="text" value={user.surname} name="surname" onChange={handleInputChange}/>
            </div>
            <div>
                <label>First Name</label>
                <input type="text" value={user.firstName} name="firstName" onChange={handleInputChange}/>
            </div>
            <div>
                <label>Patronymic</label>
                <input type="text" value={user.patronymic} name="patronymic" onChange={handleInputChange}/>
            </div>
            <div>
                <label>Username</label>
                <input type="text" value={user.username} name="username" onChange={handleInputChange}/>
            </div>
            <div>
                <label>Password</label>
                <input value={user.password} name="password" type="password" onChange={handleInputChange}/>
            </div>
            <div>
                <label>Student</label>
                <input checked={user.role==='student'} value={user.role} name="role" type="checkbox" onChange={handleInputChange}/>
            </div>
            <Link to={"/login"}>
            <button type="button" onClick={register}>Register</button>
            </Link>
        </form>
    )
}

export default Register;