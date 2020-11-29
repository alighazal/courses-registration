import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import Modal from 'react-modal';

import axios from 'axios';


function AddCourses (props){

   
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)

    const [isOpen, setIsOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(false)

    

    return (       
        
        <div>        
            <div>
                <button onClick={()=> setIsOpen( (state) => (!state))}>ADD COURSES</button>
                <Modal
                isOpen={isOpen}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
                >
                     <Form>
                <FormGroup>
                    <Label for="Department">Department</Label>
                    <Input type="text" id="Department"  placeholder="ex. CSCE" />
                </FormGroup>
                <FormGroup>
                    <Label for="CourseNumber">Course Number</Label>
                    <Input type="text" id="CourseNumber"  placeholder="ex. 1001" />
                </FormGroup>
                <FormGroup>
                    <Label for="Date">Date</Label>
                    <Input type="date" id="year"/>
                </FormGroup>
                <FormGroup>
                    <Label for="Semester">Semester</Label>
                    <Input type="select" id="semester">
                    <option>Fall</option>
                    <option>Spring</option>
                    <option>Summer</option>
                    <option>Winter</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleSelect">Grade</Label>
                    <Input type="select"  id="Grade">
                    <option>A</option>
                    <option>A-</option>
                    <option>B</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>C</option>
                    <option>C+</option>
                    <option>C-</option>
                    <option>D</option>
                    <option>D+</option>
                    <option>D-</option>
                    <option>F</option>
                    </Input>
                </FormGroup>
                
                {
                    (submitted)?
                        (error)? <div>Error .. plz try again</div> : <div> Added successfully</div> 
                        : null

                }
               
             
                <Button
                color ="primary"
                    onClick = {(e)=> {
                        e.preventDefault();

                        console.log(e.target.parentNode)
                        console.log(document.getElementById('Department').value);
                        console.log(document.getElementById('CourseNumber').value);
                        console.log(document.getElementById('Grade').value);

                        axios.post(' /api/add_course',
                        {
                            AUC_ID: props.student.auc_id,
                            Department: document.getElementById('Department').value,
                            CourseNumber: document.getElementById('CourseNumber').value,
                            Grade: document.getElementById('Grade').value,
                            Semester: document.getElementById('semester').value ,
                            Year: document.getElementById('year').value
                        }).catch ((err) => {
                            console.log(err)
                        })
                        .then((response)=> {
                            console.log(response)

                            setSubmitted(true)

                            if (response.data.command != 'INSERT' ){
                                console.log(response.data)
                                setError (true)
                            }else {

                                setTimeout(1000)
                                document.getElementById('Department').value = "";
                                document.getElementById('CourseNumber').value= "";
                                document.getElementById('Grade').value= "";
                                document.getElementById('semester').value = "";
                                document.getElementById('year').value= "";
                                setSubmitted(false)


                            }

                            
                            
                        })
                        }} >Add</Button>
                        
        
                <Button color ="secondary" onClick={()=> setIsOpen( (state) => (!state))}>Close</Button>
                
                </Form>
            


                </Modal>
            </div>

           
            <form>

           

            </form>
        </div>
    )

}

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };
  

export default AddCourses;