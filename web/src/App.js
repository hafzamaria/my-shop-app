import './App.css';
import Home from './components/home';
import Profile from './components/profile';
// import Gallery from './components/gallery';
import React from "react";
import Login from './components/login';
import Signup from './components/signup';
import Gallery from './components/gallery';
import NavBar from './components/navbar'

import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Navigate///authgaurd//jwt work
  // Link,/////it is 'a' anchor tag
 
} from "react-router-dom";
/////jwt work

import { useEffect, useContext } from "react";
import { GlobalContext } from './context';
import axios from "axios"

//////////////////////


function App() {
///////jwt work////


let { state, dispatch } = useContext(GlobalContext);


useEffect(() => {

  const getProfile = async () => {
    let baseUrl = "http://localhost:5000";
    try {
      let response = await axios({
        url: `${baseUrl}/profile`,
        method: "get",
        withCredentials: true
      })
      if (response.status === 200) {
        console.log("response: ", response.data);
        dispatch({
          type: "USER_LOGIN",
          payload: response.data
        })
      } else {
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    } catch (e) {
      console.log("Error in api call: ", e);
      dispatch({
        type: "USER_LOGOUT"
      })
    }
  }
  getProfile();
}, [])

  //////////////
  return (
    <Router>

      <NavBar/>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
       {(state.isLogin === true) ///authgaurd///jwt work
       ?
       <>
       <Route path="/profile" element={ <Profile /> } />
          <Route path="/gallery" element={ <Gallery /> } />
          <Route path="/" element={ <Home /> } />
          <Route path="*" element={ <Navigate to='/' /> } />////authgaurd///jwt work
          </>
          :null
      }
          {(state.isLogin === false) ?///authgaurd///jwt work
          <>
          <Route path="/login" element={ <Login /> } />
          <Route path="/signup" element={ <Signup /> } />
          <Route path="*" element={ <Navigate to='/login' /> } />
          </>
          :null
          }
          {(state.isLogin === null)?///authgaurd///jwt work
          <>Loding....</>
        :null
        }
          
        </Routes>
      
    </Router>
  );
}

export default App;
