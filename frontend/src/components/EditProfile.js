import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Navigate} from 'react-router-dom';
import { useState } from 'react';
import {useEffect} from 'react';
import axios from 'axios';
const name="John Doe";
function createData(col, val){
    return { col, val };
}


export default function EditProfile() {
    console.log("Profile")
    const navigate = useNavigate();
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [age, setAge] = React.useState("");
    // const [posts, setPosts] = React.useState("");
    // const [followers, setFollowers] = React.useState("");
    // const [following, setFollowing] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [err, setErr] = React.useState("");

    if(localStorage.getItem("login_token")==="null"){
      navigate("/signin");
  }
    const getDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("login_token"),
          },
        });
        console.log(res);
        if(res.status===200){
          console.log("Success");
          console.log(res.data);
          setFirstname(res.data.firstname);
          setLastname(res.data.lastname);
          setUsername(res.data.username);
          setEmail(res.data.email);
          setAge(res.data.age);
          // setPosts(res.data.posts);
          // setFollowers(res.data.followers);
          // setFollowing(res.data.following);
          setPhone(res.data.phone);
          setPassword(res.data.password);
        }
        else
        {
          console.log("Error");
        }
      }
      catch (err) {
        console.log(err);
      }
    };

    /**
     * 
     * @edit profile here
     */
    const SignUpEdit = async (e) => {
        e.preventDefault();
        try {
          console.log("SignUpEdit called");
          const creds = {
              firstname: firstname,
              lastname: lastname,
              username: username,
              email: email,
              age: age,
              phone: phone,
              password: password,
          };
          try {
            const res = await axios.patch("http://localhost:5000/api/users", creds,
            { headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("login_token"),
            }, }
            ).catch(function(error)
              { 
                console.log(error.response.status);
                if(error.response.status === 500)
                { 
                  console.log("error 500");
                  window.alert("Error - Profile not updated");
                  navigate("/admin/profile");
                }
              })
            ;
            console.log(res);
            if(res.status===200){
              window.alert("Profile Updated Succesfully");
              navigate("/admin/profile");
            }
            if(res.status==="500"){
              window.alert("Error - Profile not updated");
              navigate("/admin/profile");
            }
          } catch (error) {
            console.log("Error");
            
          }
          console.log("request passed already")
          
        }
        catch (err) {
           console.log("error");
        }

        //if(res.status===200){


        
    }
    useEffect(() => {
        console.log("getdetails useEffect called")
        getDetails();
    }, []);

    const rows = [
      createData("Name", firstname+" "+lastname),
      createData("Username", username),
      createData("Mail", email),
      createData("Age", age),
      createData("No.of posts", 0),
  
  ];
  console.log(firstname);
  console.log(lastname);
  console.log(username);
  console.log(email);
  console.log(age);
  console.log(phone);
    return (

        <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              EDIT PROFILE
            </Typography>
            <Box component="form" noValidate onSubmit={SignUpEdit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    onClick={console.log(username)}
                    name="firstname"
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    fullWidth
                    id="firstname"
                    value={firstname}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField

                    required
                    fullWidth
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    name="lastname"
                    autoComplete="family-name"
                  />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                    name="username"
                    type="username"
                    id="username"
                    autoComplete="new-username"
                    />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    fullWidth
                    name="age"
                    type="Age"
                    id="age"
                    autoComplete="new-Age"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    fullWidth
                    name="contact"
                    type="Phone"
                    id="contact"
                    autoComplete="new-Phone"
                    />
                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                MAKE CHANGES
              </Button>
            </Box>
            </Box>
            </Container>
            </ThemeProvider>

        </div>



    );
}

const theme = createTheme();
