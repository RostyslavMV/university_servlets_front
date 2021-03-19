import React, {useState, useEffect} from 'react';
import axios from "axios";

const Lecturer = props => {
    const qs = require("qs")
    const initialCourse = {
        name: ''
    };
    const [course, setCourse] = useState(initialCourse);

    const handleInputChange = event => {
        const {name, value} = event.target
        setCourse({...course, [name]: value})
    };

    const addCourse = () => {
        axios.post('http://localhost:8080/lecturer/course', {
            name: course.name,
            token: props.token
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            setCourse(initialCourse)
        }).catch(error => console.log(error))
    }

    return (
        <div>
            <form autoComplete={"off"}>
                <label>Course name</label>
                <input type="text" name={"name"} value={course.name} onChange={handleInputChange}/>
                <button type="button" onClick={addCourse}>Add course</button>
            </form>
        </div>
    );
}

export default Lecturer;