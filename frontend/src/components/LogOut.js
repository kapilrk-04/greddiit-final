import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();


    let login_token = localStorage.getItem("login_token");
    console.log("Login Token: "+login_token);
    // React.useEffect(()=>{
    //     navigate("/")
    // }, [auth])


    // localStorage.clear();
    // navigate("/");

        useEffect(() => {
            if(login_token === "null"){
                window.alert("Not Logged In");
            }
            else{
                window.alert("Logged Out");
            }
            localStorage.clear();
            navigate("/");
        }, []);
  
  }

export default LogOut;

//implement logout here