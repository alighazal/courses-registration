import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Link, useLocation, withRouter} from 'react-router-dom';

import {Badge} from 'reactstrap';

import ViewCourseReview from '../CourseReview/ViewCourseReviews';


function Course(props){

    let location = useLocation();
    const [course, setCourse] = useState({
        Name : "",
        CourseNumber: "",
        Department: "",
        Credit: "",
        Description: "",
        Notes: "",
        Crosslisted: [],
        Prerequisites: [],
        PrerequisitesID: [],
        Semesters: [],
        needPrerequisite: false,
        //available: true,
        taken: false
    })

    useEffect ( () => {

        async function fetchdata() {
            const result =  await axios.get(` /api/departments/${props.match.params.id}/${props.match.params.course}`) 
            setCourse(formatCourse (result.data, props.studentHistoryID ));
            console.log( formatCourse (result.data, props.studentHistoryID ))
        }

        fetchdata()

    }, [props.match.params.id, props.match.params.course])

    


    function formatCourse (courseRAW, courseHistory) {

        let course = {
            Name : courseRAW[0].name,
            CourseNumber: courseRAW[0].coursenumber,
            Department: courseRAW[0].department,
            Credit: courseRAW[0].credits,
            Description: courseRAW[0].description,
            Notes: courseRAW[0].notes,
            Crosslisted: [],
            Prerequisites: [],
            PrerequisitesID: [],
            Semesters: [],
            needPrerequisite: false,
            //available: true,
            taken: false
        }

        let courseID = (course.Department + '-' + course.CourseNumber).toString()

        let uniquePrerequisites = [];

        for (var i = 0; i < courseRAW.length; i++) {
            if (courseRAW[i].crosslisted_department != null)  {
                course.Crosslisted.push( {
                    Department: courseRAW[i].crosslisted_department,
                    CourseNumber: courseRAW[i].crosslisted_coursenumber
                    })
            } 

            if (courseRAW[i].semester != null)  {
                course.Semesters.push(courseRAW[i].semester)
            }    
            course.Semesters = [...new Set(course.Semesters)]
            
            if (courseRAW[i].department_2nd != null)  {

                if (!uniquePrerequisites.includes((courseRAW[i].department_2nd + courseRAW[i].coursenumber_2nd).toString())){

                    uniquePrerequisites.push((courseRAW[i].department_2nd + courseRAW[i].coursenumber_2nd).toString())

                    course.Prerequisites.push({
                        Department: courseRAW[i].department_2nd,
                        CourseNumber: courseRAW[i].coursenumber_2nd,
                        Concurrency: courseRAW[i].concurrency
                    })
                }

               
            }

            course.Prerequisites = [...new Set(course.Prerequisites)];

                        
          }

          if (course.Prerequisites.length > 0){
            for(var j = 0; j < course.Prerequisites.length; j++) {
              course.PrerequisitesID.push((course.Prerequisites[j].Department + '-' + course.Prerequisites[j].CourseNumber).toString())
              }
              
            }

            for(var k = 0; k < course.PrerequisitesID.length; k++ ){

              if (!courseHistory.includes(course.PrerequisitesID[k])){
                course.needPrerequisite = true; 
              }
            }

            
            if (courseHistory.includes(courseID)){
              course.taken = true; 
            }
            

            //console.log(courseRAW);
            //console.log( course)
            
        return course;
    } 

    return (

    <div >
        <h1>{course.Department} --  {course.CourseNumber}</h1>
        <p> { course.Name} </p>
        <p> { course.Credit} </p>
        <p> { course.Description} </p>
        
        {
            (course.Prerequisites.length !== 0)?  <p>Prerequisites</p> : null
        }

        {
            course.Prerequisites.map( cp => (
                <div key={`${cp.Department}${cp.CourseNumber}`}>
                    <Link to = {`/departments/${cp.Department}/${cp.CourseNumber}`}> 
                        <span>{cp.Department} -- {cp.CourseNumber} --</span> 
                    </Link>
                    <p>{(cp.Concurrency)? "can be concurrent" : " can't be concurrent" }</p>
                    
                </div>

            
            ))
        }

        {
            (course.Crosslisted.length !== 0)? <p>Crosslisted as</p> : null
        }

        { 
        course.Crosslisted.map( cl => (
            <p key={`${cl.Department + cl.CourseNumber }`}>{cl.Department} -- {cl.CourseNumber}</p>))
        }

        {
            (course.Notes !== "null") ? 
            <p> {course.Notes} </p> : null

        }

        {
        (course.Semesters[0] !== "null" )?
        course.Semesters.map(
            s => (
            <span key={`${s}`}> {s} </span>)):null
        }

        {
            (course.needPrerequisite)?
            <p><Badge color="danger"> Needs Prerequisites</Badge></p> : null
            
        }

        { 
            (course.taken) ? 
                <p><Badge color="dark"> taken</Badge></p>
                :<p><Badge color="primary"> not taken</Badge></p>
            
        }

        {
        
        (!course.taken && !course.needPrerequisite) ?
        <p><Badge color="success"> available</Badge></p>
        : null
            
        }


        <hr />

        <ViewCourseReview 
                Department= {course.Department} 
                CourseNumber ={course.CourseNumber}/>
       
    </div>


    )
    

}

export default  withRouter( Course);
