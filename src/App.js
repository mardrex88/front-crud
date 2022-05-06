import React, {createContext, useContext, useReducer,  useState, useRef} from 'react';
import List from './components/List';


const HOST_API = "http://localhost:8080/api";
const initialState ={
  list: [],
  item:{}
};
const Store = createContext(initialState);


const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: {item} } = useContext(Store);
  const [state, setState] = useState({})

  const onAdd = (event) => {
    event.preventDefault();
console.log("onAdd")
    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    fetch(HOST_API+"/todo",{
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(response => response.json())
    .then((todo)=> {
      dispatch({ type: "add-item", item:todo});
      setState({name:""});
      formRef.current.reset();
    });
  }

  const onEdit = (event) => {
    event.preventDefault();
    console.log("onEdit")
    const request = {
      name: state.name,
      id: item.id,
      completed: item.completed
    };

    fetch(HOST_API+"/"+item.id+"/todo",{
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type' : 'application/json',
      }
    })
    .then(response => response.json())
    .then((todo)=> {
      dispatch({ type: "update-item", item:todo});
      setState({name:""});
      formRef.current.reset();
    });
  }

  return <form ref={formRef}>
    <input type ="text" name="name" defaultValue ={item.name} onChange={(event)=>{
      setState({ ...state, name: event.target.value})
    }}></input>
    {
      item.id && <button onClick={onEdit}>Editar</button>
    }
    { 
      !item.id &&  <button onClick={onAdd}>Agregar</button>
    }
    
  </form>
}

function reducer(state , action) {
    switch (action.type) {
      case 'update-list':
        return { ...state, list: action.list}
        
      case 'update-item':
        const listUpdateEdit = state.list.map((item)=> {
          if(item.id === action.item.id){
              return action.item;
          }
          return item
        });
          return { ...state, list: listUpdateEdit, item: {}}

        case 'completed-item':
          const listUpdateCompleted = state.list.map((item)=> {
            if(item.id === action.item.id){
                return action.item;
            }
            return item
          });
            return { ...state, list: listUpdateCompleted, item: {}}
      case 'add-item':
        const newList = state.list;
        newList.push(action.item);
      return { ...state, list: newList}

      case 'complete-item':
      return { ...state, item: action.item ,list: state.list}

      case 'edit-item':
      return { ...state, item: action.item}
      case 'delete-item':
        const listUpdate = state.list.filter((item)=> {
          return item.id !== action.id;
        });
        return { ...state, list: listUpdate}

      default:
        return state
    }
  }

const StoreProvider = ({children}) =>{

  const [state, dispatch] =useReducer(reducer,initialState);
  return <Store.Provider value ={{state,dispatch}}>
    {children}
  </Store.Provider>
}

function App() {
  return (
    <StoreProvider>
      <Form/>
      <List context={Store}/>
    </StoreProvider>
  );
}

export default App;
