import React, { useEffect } from 'react';
import { useState } from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';


function ViewCourseReview (props){

    const [reviews, setReviews] = useState([{
        AUC_ID: "",
        Department: "",
        CourseNumber: "",
        Rating: 0,
        Date: "",
        Review: ""
    }])

   
    useEffect ( async ()=> {

        const res = await axios.get(` /api/course_review`, {
            params: {
                Department: props.Department,
                CourseNumber: props.CourseNumber
            }

            })
            setReviews(res.data)
    }, [props])

    return (
        <div>
            {
            
                reviews.map(
                    (review, index)=> (
                        <div>
                            <h4><strong> Review # {index+1} </strong></h4>
                            <hr />
                            <p> <strong>student: </strong>  {review.auc_id}</p>
                            <p> <strong>rating: </strong>  {review.rating}</p>
                            <p> <strong>date: </strong>   {review.date}</p>
                            <p> <strong>review: </strong>  {review.review}</p>
                            <hr />
                        </div>
                    )
                )
            }
        </div>
    )

}

export default ViewCourseReview;