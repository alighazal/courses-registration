import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom';
import {Collapse} from 'react-collapse';

import { Badge } from 'reactstrap';
import {  Button, CardBody, Card, CardTitle, CardSubtitle } from 'reactstrap';

const Course = ({course}) => (

  <div >
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
       
  </div>

) 



function DepartmentCourse (props){

    const [courses, setCourses] = useState([])
    const [coursesDetails, setCoursesDetails] = useState([])
    const [coursesDetailsLoaded, setCoursesDetailsLoaded] = useState(false)
    const [selectedIndices, setSelectedIndices] = useState([]);
    

    const select = (index) => {

      if (selectedIndices.includes(index))
        {
          let newSelectedIndices = [...selectedIndices];
          newSelectedIndices = newSelectedIndices.filter((i) => i !== index )
          //console.log(newSelectedIndices)
          setSelectedIndices(newSelectedIndices)
        }
        else {
          let newSelectedIndices = [...selectedIndices, index];
         // console.log(newSelectedIndices)
          
          setSelectedIndices(newSelectedIndices)
        }
        
    }

    const isOpened = (index) => (

      (selectedIndices.includes(index))?  true :  false

    )

    useEffect (()=> {
      //console.log("This should open now")
      setCoursesDetailsLoaded((coursesDetails.length == coursesDetails.length && coursesDetails.length > 0 ));

    }, [coursesDetails, courses ])

    useEffect ( async () => {
      const result = await axios.get(` /api/departments/${props.match.params.id}`) 
       
        console.log(result.data);
        setCourses(result.data);

    }, [props.match.params.id])


    useEffect ( async()=> {

      const cd = [];

      if (courses.length > 0){

        for ( const course of courses){
           await axios.get(` /api/departments/${course.department}/${course.coursenumber}`)
            .then( (response) => {

              setCoursesDetails((state) => [...state, formatCourse(response.data, props.studentHistoryID) ])

              //console.log(formatCourse(response.data, props.studentHistoryID))
              //cd.push(formatCourse(response.data, props.studentHistoryID));
              //console.log(formatCourse(response.data, props.studentHistoryID));  
              //setCoursesDetails(cd) 

            })
        }
      }

      

    }, [courses])


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

            for(var i = 0; i < course.PrerequisitesID.length; i++ ){

              if (!courseHistory.includes(course.PrerequisitesID[i])){
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
        
      <div>

          <h1>Course in {props.match.params.id} deparment</h1>
          {
            courses.map(
              (course, index ) => (
                <div key={`${course.coursenumber} ${course.department}` }>

                  <div >
                    
                    <Card>
                      <CardBody>
                      

                      <CardTitle tag = "h3"> {course.department} --  {course.coursenumber}  </CardTitle> 
                      <CardSubtitle tag="h6" className="mb-2 text-muted">{ course.name} </CardSubtitle> 

                    <div>

                      <Button color = "primary"
                        type="button" class="btn btn-primary btn-sm"
                        onClick={() => select(index) }>Expand</Button>
                      
                      <Collapse isOpened={isOpened(index)}>
                        <Card>
                          <CardBody>
                            { (coursesDetails.length == courses.length && coursesDetails.length > 0)? <Course course = {coursesDetails[index]} /> : "Loading" }
                          </CardBody>
                        </Card>
                      </Collapse>

                      <div
                        style =  {{
                            display: "flex"                          
                          }}> 
                                        
                        {
                          (coursesDetails.length == courses.length && coursesDetails.length > 0)? 
                            (coursesDetails[index].needPrerequisite)?
                            <p><Badge color="danger"> Needs Prerequisites</Badge></p> : null
                          :null
                        }

                        {
                          (coursesDetails.length == courses.length && coursesDetails.length > 0)? 
                            (coursesDetails[index].taken) ? 
                              <p><Badge color="dark"> taken</Badge></p>
                              :<p><Badge color="primary"> not taken</Badge></p>
                          : null
                        }

                        {
                        (coursesDetails.length == courses.length && coursesDetails.length > 0)? 
                        (!coursesDetails[index].taken && !coursesDetails[index].needPrerequisite) ?
                          <p><Badge color="success"> available</Badge></p>
                          : null
                          :null
                        }

                      </div>  


                      <Link to = {{
                            pathname: `/departments/${course.department}/${course.coursenumber}`,
                            state:  coursesDetails[index] 
                        }}>  <h5> more details </h5> </Link>

                    </div>

                     </CardBody>
                    
                    

                    </Card>
                  </div>
                  
                </div>
              )
            )
          } 

        </div>)
    

}

  

export default withRouter(DepartmentCourse);
