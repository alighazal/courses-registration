import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import ViewCourseReview from '../CourseReview/ViewCourseReviews';



function Course(props){

    const [course, setCourse] = useState({
        Name : "",
        CourseNumber: "",
        Department: "",
        Credit: 0 ,
        Description: "",
        Notes: "",
        Crosslisted: [],
        Prerequisites: [],
        Semesters: []
    })

     useEffect (() => {
         axios.get(` /api/departments/${props.match.params.id}/${props.match.params.course}`).then( (response) => {
            // handle success
            //console.log(response.data);
            setCourse (formatCourse(response.data));
            console.log (formatCourse(response.data));
          }) 
          //console.log(props.match.params.id)
      }, [props.match.params.id,props.match.params.course ])

      function formatCourse (courseRAW) {

        let course = {
            Name : courseRAW[0].Name,
            CourseNumber: courseRAW[0].CourseNumber,
            Department: courseRAW[0].Department,
            Credit: courseRAW[0].Credits,
            Description: courseRAW[0].Description,
            Notes: courseRAW[0].Notes,
            Crosslisted: [],
            Prerequisites: [],
            Semesters: []
        }

        let uniquePrerequisites = [];

        for (var i = 0; i < courseRAW.length; i++) {
            if (courseRAW[i].Crosslisted_Department != null)  {
                course.Crosslisted.push( {
                    Department: courseRAW[i].Crosslisted_Department,
                    CourseNumber: courseRAW[i].Crosslisted_CourseNumber
                    })
            } 

            if (courseRAW[i].Semester != null)  {
                course.Semesters.push(courseRAW[i].Semester)
            }    
            course.Semesters = [...new Set(course.Semesters)]
            
            if (courseRAW[i].Department_2ND != null)  {

                if (!uniquePrerequisites.includes((courseRAW[i].Department_2ND + courseRAW[i].CourseNumber_2ND).toString())){

                    uniquePrerequisites.push((courseRAW[i].Department_2ND + courseRAW[i].CourseNumber_2ND).toString())

                    course.Prerequisites.push({
                        Department: courseRAW[i].Department_2ND,
                        CourseNumber: courseRAW[i].CourseNumber_2ND,
                        Concurrency: courseRAW[i].Concurrency
                    })
                }

               
            }

            course.Prerequisites = [...new Set(course.Prerequisites)];
        }
        return course;
      } 

   
      return ( 
      
        <div>

            <h1>Course </h1>
          
        
            <div >
                <h3> {course.Department} --  {course.CourseNumber} </h3>
                <p> { course.Name} </p>
                <p> { course.Credit} </p>
                <p> { course.Description} </p>
               
                {
                    (course.Prerequisites.length !== 0)?  <p>Prerequisites</p> : null
                }

                {
                    course.Prerequisites.map( cp => (
                        <div>
                            <Link to = {`/departments/${cp.Department}/${cp.CourseNumber}`}> 
                            
                                <p>{cp.Department} -- {cp.CourseNumber}</p> 
                            </Link>
                            <p>{cp.Concurrency}</p>
                        </div>

                    
                    ))
                }
             
                {
                    (course.Crosslisted.length !== 0)? <p>Crosslisted as</p> : null
                }

                { 
                course.Crosslisted.map( cl => (
                    <p>{cl.Department} -- {cl.CourseNumber} -- {cl.Concurrency}</p>))
                }

                {
                    (course.Notes !== "null") ? 
                    <p> {course.Notes} </p> : null
   
                }
            
                {
                (course.Semesters[0] !== "null" )?
                course.Semesters.map(
                    s => (
                    <span> {s} </span>)):null
                }
                 
                <hr/>
            </div>

            <ViewCourseReview 
                Department= {course.Department} 
                CourseNumber ={course.CourseNumber}/>
            
        </div>
            
            
          

        )
    

}

export default  Course;
