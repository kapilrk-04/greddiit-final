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
import { useNavigate, Navigate, useParams} from 'react-router-dom';
import { useState } from 'react';
import {useEffect} from 'react';
import axios from 'axios';
const name="John Doe";


function CreatePost() {
    console.log("CREATE NEW SUBGREDDIIT")
    const navigate = useNavigate();
    const { subgreddiit } = useParams();
    const [text, setText] = useState("");
    const [current_user, setCurrentUser] = useState("");
    const [upvotes, setUpvotes] = useState([]);
    const [downvotes, setDownvotes] = useState([]);
    const [comments, setComments] = useState([]);
    const [data, setData] = useState([]);
    
    const getData = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/subgreddiits/onesub",{
          name: subgreddiit
        }, {
          headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("login_token"),
          },
        }).catch ( function (error)
        {
          if (error.response.status === 401)
          {
            navigate("/signin");
            return;
          }
        }
        );
        console.log(res);
        if(res.status===200){
          console.log("Success");
          console.log(res.data);
          setData(res.data);
          console.log(data[0].description)
          console.log(data);
        }
        else
        {
          console.log("Error");
          navigate("/");
        }
      }
      catch (err) {
        console.log(err);
      }
    };

    const createSub = async (e) => {
        e.preventDefault();
        console.log("text: ", text);
        let text2 = text;
        let textarr = text2.split(" ");
        for (let i=0; i<textarr.length; i++){
          textarr[i] = textarr[i].replace(/[^a-zA-Z ]/g, "").toLowerCase();
          let cnt = 0;
          if(data[0].banned_words.includes(textarr[i]))
          {
            cnt++;
          }
          if(cnt>0)
          {
            window.alert("Your post contains banned words!");
          }
        }

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
            const res = await axios.post("http://localhost:5000/api/posts/create", {
                text : text,
                user : current_user,
                sub : subgreddiit,
                upvotes : upvotes,
                downvotes : downvotes,
                comments : comments,
                isComment : false,
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
                window.alert("Post created successfully!");
                navigate("/subgreddiits/"+ subgreddiit);
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

    useEffect(() => {
        getData();
    }, []);


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
              CREATE NEW POST
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={createSub}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                    TEXT:
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    autoComplete="given-text"
                    name="text"
                    
                    onChange={(e) => setText(e.target.value)}
                    required
                    fullWidth
                    id="text"
                    autoFocus
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
              <Button
                type="submit"
                disabled={text === "" ? true : false}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                create
              </Button>
                </Grid>

              <Grid item xs={12}>
                <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(-1)}
                sx={{ mt: 3, mb: 2 }}
                >
                    Back
                </Button>
                </Grid>
            </Box>
            </Box>
            </Container>
            </ThemeProvider>

        </div>



    );
}

const theme = createTheme();

export default CreatePost;