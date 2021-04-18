import React, {useState, useEffect} from 'react';
import axios from "axios";

const Lecturer = props => {
    const qs = require("qs")
    const initialCourse = {
        name: ''
    };
    const [course, setCourse] = useState(initialCourse);
    const [courses, setCourses] = useState([]);

    const handleInputChange = event => {
        const {name, value} = event.target
        setCourse({...course, [name]: value})
    };

    const handleEnrollmentChange = (enr, courseId, event) => {
        const {name, value} = event.target
        if (name === "mark") {
            setCourses(courses.map(course => (course.courseId === courseId ? {
                courseId: course.courseId,
                courseName: course.courseName,
                lecturerEnrollmentResponses:
                    course.lecturerEnrollmentResponses.map(enrollment => (enrollment.studentId === enr.studentId ? {
                        mark: value,
                        review: enrollment.review,
                        studentId: enrollment.studentId,
                        studentName: enrollment.studentName,
                        isReviewed: enrollment.isReviewed
                    } : enrollment))
            } : course)))
        }
        if (name === "review") {
            setCourses(courses.map(course => (course.courseId === courseId ? {
                courseId: course.courseId,
                courseName: course.courseName,
                lecturerEnrollmentResponses:
                    course.lecturerEnrollmentResponses.map(enrollment => (enrollment.studentId === enr.studentId ? {
                        mark: enrollment.mark,
                        review: value,
                        studentId: enrollment.studentId,
                        studentName: enrollment.studentName,
                        isReviewed: enrollment.isReviewed
                    } : enrollment))
            } : course)))
        }
    };

    useEffect(() => {
            if (props.loggedIn) {
                getCourses()
            }
        }, [props.loggedIn]
    )

    const getCourses = () => {
        axios.get('http://localhost:8180/enrollment', {
            headers: {
                'Authorization': 'bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            setCourses(resp.data.courseResponses)
        }).catch(error => console.log(error))
    }

    const addCourse = () => {
        axios.post('http://localhost:8180/courses', {
            name: course.name,
        }, {
            headers: {
                'Authorization': 'bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            setCourse(initialCourse)
            getCourses()
        }).catch(error => console.log(error))
    }

    const addMark = (enr, courseId) => {
        axios.post('http://localhost:8180/enrollment/mark', {
            studentId: enr.studentId,
            courseId: courseId,
            mark: enr.mark,
            review: enr.review
        }, {
            headers: {
                'Authorization': 'bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            setCourses(courses.map(course => (course.courseId === courseId ? {
                courseId: course.courseId,
                courseName: course.courseName,
                lecturerEnrollmentResponses:
                    course.lecturerEnrollmentResponses.map(enrollment => (enrollment.studentId === enr.studentId ? {
                        mark: enrollment.mark,
                        review: enrollment.review,
                        studentId: enrollment.studentId,
                        studentName: enrollment.studentName,
                        isReviewed: true
                    } : enrollment))
            } : course)))
        }).catch(error => console.log(error))
    }

    const removeStudent = (courseId, studentId) => {
        axios.post('http://localhost:8180/enrollment/lecturer/remove',
            {
                studentId: studentId,
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
            <form autoComplete={"off"}>
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <label className="sr-only" htmlFor="inlineFormInputGroup">Course name</label>
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">Course name</div>
                            </div>
                            <input type="text" name={"name"} value={course.name}
                                   onChange={handleInputChange} className="form-control" id="inlineFormInput"
                                   placeholder="Course name"/>
                        </div>
                    </div>
                    <div className="col-auto">
                        <button className={"btn btn-primary mb-2"} type="button" onClick={addCourse}>Add course
                        </button>
                    </div>
                </div>
            </form>
            <div>
                {courses.map(course => (
                        <div key={course.courseId}>
                            <h2>{course.courseName}</h2>
                            <table className={"table"}>
                                <thead>
                                <tr>
                                    <th scope="col">Student</th>
                                    <th scope="col">Mark</th>
                                    <th scope="col">Review</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {course.lecturerEnrollmentResponses.filter((enrollment) => enrollment.isReviewed).map((enrollment) => (
                                    <tr key={enrollment.studentId.toString() + course.courseId.toString()}>
                                        <td>
                                            {enrollment.studentName}
                                        </td>
                                        <td>
                                            {enrollment.mark}
                                        </td>
                                        <td>
                                            {enrollment.review}
                                        </td>
                                    </tr>
                                ))}
                                {course.lecturerEnrollmentResponses.filter((enrollment) => !enrollment.isReviewed).map((enrollment) => (
                                    <tr key={enrollment.studentId.toString() + course.courseId.toString()}>
                                        <td>
                                            {enrollment.studentName}
                                        </td>
                                        <td>
                                            <input className={"form-control"} type="number" min={0} max={100}
                                                   value={enrollment.mark ? enrollment.mark : undefined} name={"mark"}
                                                   onChange={(event) => handleEnrollmentChange(enrollment, course.courseId, event)}/>
                                        </td>
                                        <td>
                                            <textarea className={"form-control"} value={enrollment.review ? enrollment.review : undefined}
                                                      name={"review"}
                                                      onChange={(event) => handleEnrollmentChange(enrollment, course.courseId, event)}/>
                                        </td>
                                        <td>
                                            <button type="button" className={"btn btn-success"}
                                                    onClick={() => addMark(enrollment, course.courseId)}>Put mark
                                            </button>
                                            <button type="button" className={"btn btn-danger"}
                                                    onClick={() => removeStudent(course.courseId,enrollment.studentId)}>Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )
                }
            </div>
        </div>
    );
}

export default Lecturer;