import React,{useContext,useEffect, useState,formRef} from 'react';



const List = (props) =>{
    const HOST_API = "http://localhost:8080/api";
    const { dispatch, state } = useContext(props.context);
  
    useEffect(()=> {
      fetch(HOST_API+"/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type:"update-list", list })
      })
    },[state.list.length,dispatch]);
  
  
    const onDelete = (id) => {
      fetch(HOST_API+"/"+id+"/todo",{
        method: "DELETE"
      })
      .then((list)=> {
        dispatch({ type: "delete-item", id});
      });
    };
  
    const onEdit= (todo) => {
      dispatch({ type: "edit-item", item: todo});
    };
   


  const toComplete = (todo) => {
    console.log(todo)
    todo.completed = true;
    console.log(todo)

    fetch(HOST_API+"/"+todo.id+"/todo",{
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(response => response.json())
    .then((item)=> {
      dispatch({ type: "completed-item", item:item});
    });
  }
  
    return <div>
      <table>
        <thead>
          <tr>  
            <td>ID  |</td>
            <td>Nombre</td>
            <td>¿Está Completado?</td>
          </tr>
        </thead>
        <tbody>
          {
          state.list.map((todo) => {
              return <tr key={todo.id}>
                  <td>{todo.id} |</td>
                  <td>{todo.name}</td>
                  <td>{todo.completed ===true ?"SI":"NO "}{!todo.completed && <button onClick={()=>toComplete(todo)}>ok</button>}</td>
                  <td>
                    <button onClick={()=>onDelete(todo.id)}>Eliminar</button>
                    <button onClick={()=>onEdit(todo)}>Editar</button>
                  </td>
                  <td>
                  </td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  }
  export default List;