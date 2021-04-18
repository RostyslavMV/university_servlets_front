import React, {useState, useEffect} from 'react';
import axios from "axios";

const Student = props => {
    const qs = require("qs")
    const initialCourse = {
        name: ''
    };
    const [course, setCourse] = useState(initialCourse);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const handleInputChange = event => {
        const {name, value} = event.target
        setCourse({...course, [name]: value})
    };

    useEffect(() => {
            if (props.loggedIn) {
                getCourses()
            }
        }, [props.loggedIn]
    )

    const getCourses = () => {
        axios.get('http://localhost:8180/courses', {
            headers: {
                'Authorization': 'bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            setAvailableCourses(resp.data.availableCourses)
            setEnrolledCourses(resp.data.enrolledCourses)
        }).catch(error => console.log(error))
    }

    const enroll = (courseId) => {
        axios.post('http://localhost:8180/enrollment', {
            courseId: courseId
        }, {
            headers: {
                'Authorization': 'bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            getCourses()
        }).catch(error => console.log(error))
    }

    const unenroll = (courseId) => {
        axios.post('http://localhost:8180/enrollment/unenroll',
            {
                courseId: courseId
            }, {
                headers: {
                    'Authorization': 'bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
            console.log(resp.data)
            getCourses()
        }).catch(error => console.log(error))
    }

    return (
        <div>
            <div>
                <h2>Enrolled courses</h2>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Lecturer</th>
                        <th scope="col">Mark</th>
                        <th scope="col">Review</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {enrolledCourses.filter((course) => course.mark === null).map((course) => (
                        <tr key={course.id}>
                            <td>
                                {course.name}
                            </td>
                            <td>
                                {course.surname} {course.firstName} {course.patronymic}
                            </td>
                            <td>
                                {course.mark}
                            </td>
                            <td>
                                {course.review}
                            </td>
                            <td>
                                <button type="button" className={"btn btn-danger"}
                                        onClick={() => unenroll(course.id)}>Unenroll
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Completed courses</h2>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Lecturer</th>
                        <th scope="col">Mark</th>
                        <th scope="col">Review</th>
                    </tr>
                    </thead>
                    <tbody>
                    {enrolledCourses.filter((course) => course.mark !== null).map((course) => (
                        <tr key={course.id}>
                            <td>
                                {course.name}
                            </td>
                            <td>
                                {course.surname} {course.firstName} {course.patronymic}
                            </td>
                            <td>
                                {course.mark}
                            </td>
                            <td>
                                {course.review}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Available courses</h2>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Lecturer</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {availableCourses.map((course) => (
                        <tr key={course.id}>
                            <td>
                                {course.name}
                            </td>
                            <td>
                                {course.surname} {course.firstName} {course.patronymic}
                            </td>
                            <td>
                                <button type="button" className={"btn btn-success"}
                                        onClick={() => enroll(course.id)}>Enroll
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default Student;
