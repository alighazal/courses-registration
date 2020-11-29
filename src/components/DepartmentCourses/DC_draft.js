import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function DepartmentCourse (props){

    const [courses, setCourses] = useState([])

     useEffect (() => {

         axios.get(` /api/departments/${props.match.params.id}`).then( (response) => {
            // handle success
            setCourses(response.data)
            console.log(response.data)
          }) 
          console.log(props.match.params.id)
      }, [])
      
      return (
          
        <div>

          <h1>Course in {props.match.params.id} deparment</h1>
          {
            courses.map(
              (course) => (
                <div key={`${course.CourseNumber} ${course.Department}` }>

                  <div >
                    <Link to = {`/departments/${course.Department}/${course.CourseNumber}`} >
                     <h3> {course.Department} --  {course.CourseNumber} </h3>
                    </Link>
                     <p> { course.Name} </p>
                     <hr/>
                  </div>
                  
                </div>
              )
            )
          } 

        </div>)
    

}

  

export default DepartmentCourse;
