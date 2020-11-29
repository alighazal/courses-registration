import React, { useEffect, useState } from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import Rating from 'react-rating';
import axios from 'axios';


function 
AddCourseReview (props){

    let location = useLocation();
    let history = useHistory();
    
    const [wordCount, setWordCount] = useState(0)
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)

    return (
        <div>
            <h1>ADD COURSE REVIEW</h1>
            <h3>YOU ARE ADDING REVIEW OF {location.state.course.department} | {location.state.course.coursenumber} </h3>
            <hr/>
            
            <h2>Rate your course: </h2>
            <Rating
            initialRating={rating}
            onClick = { (value)=> {
                console.log(value);
                setRating(value);
            }}/>
            <hr/>
            
            <form>
            <textarea 
                placeholder = {"enter your reveiw here"}
                type = "text"
                maxLength = "1000"
                onChange = {
                    (e)=> {
                        setWordCount( e.target.value.length)
                        setReview(e.target.value)
                    }
                }
                style = {{
                    height : 250,
                    padding: 5,
                    width: "80%",
                    wordBreak: "break-word",
                    resize :"none"
                }}
            
            />
            <p>{1000 - wordCount} character left</p>

            <button
            onClick = {
                (e) =>{
                    e.preventDefault();
                    setTimeout(2000)
                    history.goBack();

                }
            }
            >disregard</button>

            <button type = "submit"

            onClick = {(e)=> {
                e.preventDefault();

                let dt = new Date();
                let date = dt.getFullYear()
                    + '-' + (dt.getMonth()+1)
                    + '-' + (dt.getDate());
                

                console.log ({
                    AUC_ID: location.state.student.auc_id,
                    Department: location.state.course.department,
                    CourseNumber: location.state.course.coursenumber,
                    rating,
                    review,
                    date

                })

                axios.post(' /api/add_review',
                    {
                    AUC_ID: location.state.student.auc_id,
                    Department: location.state.course.department,
                    CourseNumber: location.state.course.coursenumber,
                    rating,
                    review,
                    date})

                setTimeout(2000)
                history.goBack();

            }}>submit</button>

            </form>
        </div>
    )

}

export default AddCourseReview;