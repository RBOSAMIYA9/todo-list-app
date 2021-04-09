import React from 'react'
import 'font-awesome/css/font-awesome.min.css';


function List({taskList ,deleteTask,editTask,taskCompleted}) {
    // console.log("task ",taskList ,deleteTask,editTask);
    
    return (
        <>
            {
                taskList.map((tasks)=>(
                <div className="list-item-container "  key={tasks.id} >
                    <div className="list">
                        {tasks.isCompleted && <i className="fa fa-check completed"></i>}
                        <p className="list-item" onClick={(e)=>taskCompleted(tasks.id)} >{tasks.task}</p>
                        <i className="fa fa-pencil-square-o fa-1x" onClick={(e)=>editTask(tasks.id)}></i>
                        <i className="fa fa-trash fa-1x" onClick={(e)=>deleteTask(tasks.id)}></i>
                        
                    </div>
                <hr/>
                </div>
                ))
            }
            
        </>  
        
    )
}

export default List
