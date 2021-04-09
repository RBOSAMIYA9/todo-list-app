import React from 'react'
import styled from 'styled-components';

function DateAndTime({activeTasks}) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    var now = new Date();
    var day = days[now.getDay()];
    var month = months[now.getMonth()];
    return ( <DateWithTime> 
                <p>{day}, {month} {now.getDay()}</p>
                <span> {activeTasks} active task</span>
            </DateWithTime>
    )
}

export default DateAndTime;
const DateWithTime = styled.div `
    color:white;
    flex-grow:1;
    ${'' /* background-color:red; */}
    
    p{
        margin-bottom:0px;
        font-size:1.2rem;
    } 
    span{
        font-size:1rem;
    }
`;