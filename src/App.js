import DateWithTime from './DateAndTime'
import styled from 'styled-components';
import List from './List';
import React , { useState ,useEffect}from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db , auth, provider } from "./firebase";


function App() {
  // console.log("env",process.env.REACT_APP_MESSAGINGSENDERID,process.env.REACT_APP_NOT_SECRET_CODE);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [getTask, setGetTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState('');
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  useEffect(() => {
    getTodoList();
  }, []); 

  const getTodoList = () => {
    if(user)
    {
      db.collection("todos").where("email", "==", user.email).onSnapshot(function (querySnapshot){
        setTaskList(
              querySnapshot.docs.map((doc) => ({
                id: doc.id,
                task: doc.data().task,
                isCompleted: doc.data().isCompleted,
                email:doc.data().email
              }))
            );
      }
        
      )
    }
   

    // db.collection("todos").onSnapshot(function (querySnapshot) {
    //   setTaskList(
    //     querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       task: doc.data().task,
    //       isCompleted: doc.data().isCompleted,
    //       email:doc.data().email
    //     }))
    //   );
    // });
  }
  
  const signOut = () => {
    auth.signOut().then(()=>{
        localStorage.removeItem('user')
        setUser(null)
    })
  }

const signIn = () => {
  auth.signInWithPopup(provider).then((result)=>{
      let user = result.user;
      let newUser = {
          name: user.displayName,
          email: user.email
      }
      localStorage.setItem('user', JSON.stringify(newUser))
      // console.log(newUser);
      setUser(newUser);
  }).catch((error)=>{
      console.log(error.message);
  })
}

  
  const taskCompleted=(taskId)=>{
    // console.log("task completed");
    const taskToEdit = taskList.find((item) => item.id === taskId);
    // console.log("taskToEdit",taskToEdit);
    console.log("taskToEdit id",taskToEdit.id);
    console.log("taskToEdit isCompleted",taskToEdit.isCompleted);
    console.log("taskToEdit task",taskToEdit.task);
    console.log("before",taskList);
    var temp = taskToEdit.isCompleted;
    console.log(temp);
    db.collection("todos").doc(taskId.toString() ).update({
      isCompleted: !taskToEdit.isCompleted  ,
    });
    setTaskList(
      taskList.map((item) => {
        if (item.id === taskToEdit.id) {
          return { ...item, isCompleted: ! (item.isCompleted)};
        }
        return item;
      })
    );
    
  }
  const editTask = (taskId) => {
    const taskToEdit = taskList.find((item) => item.id === taskId);
    console.log("task to edit",taskToEdit.task);
    
    setIsEditing(true);
    setGetTask(taskToEdit.task);
    setEditID(taskToEdit.id)
  }
  const deleteTask = (taskId) =>{
    // console.log(taskId);
    db.collection("todos").doc(taskId).delete();
    setTaskList(taskList.filter((taskToDelete)=> taskToDelete.id !== taskId ))
    console.log("deleted");
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("clicked");
    if(!getTask)
    {
      //show alert  please enter some value
    }
    else if( getTask && isEditing)
    {
      setTaskList(
        taskList.map((item) => {
          if (item.id === editID) {
            return { ...item, task: getTask };
          }
          return item;
        })
      );
      db.collection("todos").doc(editID).update({
        task: getTask,
      });
      setGetTask('');
      setEditID('');
      setIsEditing(false);
      // showAlert(true, 'success', 'value changed');
    }
    // add task
    else{
      var newTask = {
        id : uuidv4(),
        task:getTask,
        isCompleted:false,
        email:user.email
      }
      setTaskList([...taskList,newTask])
      setGetTask('');
      db.collection("todos").add(newTask);
      console.log("added collection to db");
    }
    
  }
  
  // console.log(user);
  // const myuser = false;
  return (
    <>
    
    <h1 className="heading">ToDo list App</h1>
    
    { user ? (
      <>
          <div className="nav-bar">
          <span>
            Namaste, {user.name} 👋  
          </span>

          <span> | </span>
          
          <button className="signout" onClick={signOut}>
            Sign out
          </button>
        </div>
          <section  className="section section-center">
          <div  className="todo-container">
            <HeadSection>
              <DateWithTime activeTasks={taskList.length}/>
              <p className="task">Incomplete Task (3)</p>
              <p className="task">Complete Task (5)</p>
            </HeadSection>
          <AddTaskSection>
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <input
                type='text'
                className='task-input'
                placeholder='e.g. deploy code'
                value={getTask}
                onChange={(e) => setGetTask(e.target.value)}
              />
              <button type='submit' className='submit-btn'>
                Add Task
              </button>
            </div>
          </form>
            </AddTaskSection>
            <hr/>
            <List taskList={taskList} deleteTask={deleteTask} taskCompleted={taskCompleted} editTask={editTask}/>
          </div>
        </section>
      </>
    )  : (<div className="btn-container">
      <button onClick={signIn}>
        Sign In with Google
      </button>
    </div>)
    
    }

   
    </>
  );
}

export default App;

const HeadSection = styled.div `
    color:white;
    font-size:1.2rem;
    display:flex;

    .task{
      margin-left:1.5rem;
    }
`;

const AddTaskSection = styled.div `
    padding:2rem;
    input{
      width:50%;
      padding:0.5rem;
    }
`;