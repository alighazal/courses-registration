import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  {Link, useHistory} from 'react-router-dom'
import AddCourses from '../Course/AddCourses';


function History (props){

    let history = useHistory();

    useEffect (()=> {
        console.log(props.studentHistory[0].year)
    })


    return (
        <div>
            <AddCourses student = {props.student}></AddCourses>
            <hr />

            
            {
                props.studentHistory.map( (course, index) => (
                    <div key={`${course.coursenumber} ${course.department}` }>
                        <span>  {index + 1} -  {course.department} || {course.coursenumber} 
                        || Grade: {course.grade} || {course.semester} || {course.year.substring(0, 4)} </span>
                        <Link to = {{
                            pathname: '/add_course_review',
                            state: { course, student: props.student }
                        }}> add review </Link>
                    </div>
                    )
                )
            }

            <hr/>


        </div>   
    
    )

}

export default History;