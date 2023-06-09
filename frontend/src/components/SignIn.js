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

import axios from 'axios';
import jwt_decode from 'jwt-decode';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function LoginUp() {
    console.log("LoginUp")
    // console.log("Auth: " + localStorage.getItem("Auth"));
    // console.log("User: " + localStorage.getItem("user"));
    console.log("Token: " + localStorage.getItem("login_token"));
    const [login, setLogin] = React.useState(false);
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [age, setAge] = React.useState("");
    const [password, setPassword] = React.useState("");
    // const [posts, setPosts] = React.useState("");
    //const [followers, setFollowers] = React.useState(Array);
    // const [following, setFollowing] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [x, setX] = useState(0);
    const [user, setUser] = useState();
    const navigate = useNavigate();

    React.useEffect(()=>{
      let logtoken = localStorage.getItem("login_token");
      if(logtoken !== "null" && logtoken !== null){
        navigate("/admin/profile");
      } 
    }, []);

    //sign-up data
    const SignUpHandleSubmit = async(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      var firstname = data.get('firstname');
      var lastname = data.get('lastname');
      var username = data.get('username');
      var email = data.get('email');
      var age = data.get('age');
      var phone = data.get('contact');
      var password = data.get('password');

      let creds = {
        "firstname": firstname,
        "lastname": lastname,
        "username": username,
        "email": email,
        "age": age,
        "phone": phone,
        "password": password
      }
      console.log("creds:",creds);
      try{
        const res = await axios.post("http://localhost:5000/api/users", creds, 
        {headers: { 'Content-Type': 'application/json' },
        }).catch(function(error)
        { 
          console.log(error.response);
          if(error.response.status === 400)
          { 
            window.alert("ERROR - Bad request");
            window.location.reload();
          }
        });
        console.log(res);
        if (res.status === 200) {
          console.log(res);
          localStorage.setItem("login_token", null);
          //setLogin(true);
          window.alert("User created");
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        setLogin(false);
      }
    };

    //sign-in data
    const HandleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      var username = data.get('email');
      var password = data.get('password');
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });

      let creds = {
        "username": username,
        "password": password
      }
      console.log(creds);
      try{
        const res = await axios.post("http://localhost:5000/api/auth", creds, 
        {headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 200) {
          console.log(res);
          localStorage.setItem("login_token", res.data.token);
          setLogin(true);
          navigate("/admin/profile");
        }
      } catch (error) {
        console.log(error);
        if(error.response.status !== 200)
        {
          window.alert("Error - invalid username/password");
          window.location.reload();
        }
        setLogin(false);
      }
    };
    return (
        <React.Fragment>
            {login ? 
            
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
                        Sign in
                      </Typography>
                      <Box component="form" onSubmit={HandleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
    
                          label="Username"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          onChange={({ target: { email } }) => setUsername(email)}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          onChange={({ target: { password } }) => setPassword(password)}
                        />
                        <Button
                          type="submit"
                          disabled = {username === "" || password === ""}
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Sign In
                        </Button>
                        <Grid container>
                          <Grid item>
                            <Button onClick={() => setLogin(false)}>Sign Up</Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                  </Container>
                </ThemeProvider>                
                </div>
                :

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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={SignUpHandleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstname"
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    onChange={({ target: { firstname } }) => setFirstname(firstname)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    onChange={({ target: { lastname } }) => setLastname(lastname)}
                    autoComplete="family-name"
                  />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="username"
                    label="Username"
                    type="username"
                    id="username"
                    onChange={({ target: { username } }) => setUsername(username)}
                    autoComplete="new-username"
                    />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={({ target: { email } }) => setEmail(email)}
                    autoComplete="email"
                  />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="age"
                    label="Age"
                    type="Age"
                    id="age"
                    onChange={({ target: { age } }) => setAge(age)}
                    autoComplete="new-Age"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="contact"
                    label="Phone"
                    type="Phone"
                    id="contact"
                    onChange={({ target: { phone } }) => setPhone(phone)}
                    autoComplete="new-Phone"
                    />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={({ target: { password } }) => setPassword(password)}
                    autoComplete="new-password"
                  />
                </Grid>

              </Grid>
              <Button
                type="submit"
                disabled = {firstname === "" || lastname === "" || username === "" || email === "" || age==="" || phone==="" || password === ""}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                <Button onClick={() => setLogin(true)}>Login</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
      
      </div>
        
        
            }
        </React.Fragment>

      
        
    )

}

const theme = createTheme();


export default LoginUp;