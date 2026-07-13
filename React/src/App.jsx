import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
	let [arr,setArr]=useState([]);
  let [task,setTask]=useState("");
  let handleSubmit=(event)=>
  {
    event.preventDefault();
    setArr([...arr,task]);      //spread operator purana array rakho and naya add karo
    if(task=="")
    {
      alert("String cannot be empty");
      setArr([...arr])
    }
    setTask("");

  }
  let handleChange = (event)=>
  {
    setTask(event.target.value);        //when u print the event suke target ke andar ke value me jo humne type kiya hai voh rahega

  }

  let handleClick=(index)=>
  {
    setArr(arr.filter((ele,i)=>i!==index));
  }
  return (
    <div className="container">
        <h2>To Do App</h2>
      
        <form onSubmit={()=>handleSubmit(event)}>    
          <input onChange={()=>handleChange(event)} value={task} type='text'/> 
          <button type='submit' className='add-btn'>Submit</button>
        </form>
        <div className='bottom'>
          {arr.map(
            (str,index)=>
                <div className='card' key={index}>
                    <strong>{str}</strong>
                    <button onClick={()=>handleClick(index)} className='delete-btn'>Delete</button>
                </div>          
            )}
        </div>

    </div>
  )
}

export default App
