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


function CreateNewSub() {
    console.log("CREATE NEW SUBGREDDIIT")
    const navigate = useNavigate();
    const [current_user, setCurrentUser] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [banned_words, setBannedWords] = useState([]);


    const createSub = async (e) => {
        e.preventDefault();
        console.log("name: ", name);
        console.log("description: ", description);
        console.log("tags: ", tags);
        console.log("banned_words: ", banned_words);
        console.log("current_user: ", current_user);
        try {

           try{
             const curr_user = await axios.get("http://localhost:5000/api/users", {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("login_token"),
                },
            });
            console.log(curr_user);
            setCurrentUser(curr_user.data._id);
            }catch(error){
                console.log(error);
              
           }
            const res = await axios.post("http://localhost:5000/api/subgreddiits", {
                name: name,
                description: description,
                tags: tags,
                banned_words: banned_words,
                moderators: current_user,
                followers: [current_user],
                blocked_users: [],
                join_requests: [],
                posts: [],
                reports: [],
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("login_token"),
                },
            });
            console.log(res);
            if(res.status===200){

                console.log("Success");
                console.log(res.data);
                window.alert("Subgreddiit created successfully!");
                navigate("/mysubgreddiits");
            }
            else
            {
                console.log("Error");
                window.alert("Error creating subgreddiit!");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

          


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
              CREATE NEW SUBGREDDIIT
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={createSub}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                    Name: 
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    id="name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={3}>
                    Description: 
                </Grid>
                <Grid item xs={9}>
                  <TextField

                    required
                    fullWidth
                    id="description"
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                    autoComplete="description"
                  />
                </Grid>
                <Grid item xs={3}>
                    Tags: (separate by comma)
                </Grid>
                <Grid item xs={9}>
                    <TextField
                    required
                    fullWidth
                    name="tags"
                    onChange={(e) => setTags((e.target.value).split(","))}
                    type="tags"
                    id="tags"
                    autoComplete="tags"
                    />
                </Grid>
                <Grid item xs={3}>
                    Banned Keywords: (separate by comma)
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    required
                    fullWidth
                    id="banned_words"
                    name="banned_words"
                    onChange={(e) => setBannedWords((e.target.value).split(","))}
                    autoComplete="banned_words"
                  />
                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                create
              </Button>
            </Box>
            </Box>
            </Container>
            </ThemeProvider>

        </div>



    );
}

const theme = createTheme();

export default CreateNewSub;