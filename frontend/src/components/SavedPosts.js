import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { height } from '@mui/system';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { TextField } from '@mui/material';
import { set } from 'mongoose';


function SavedPosts() {
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = React.useState([]);
    const [comments, setComments] = React.useState([]);
    const [curr_user, setCurrUser] = React.useState([]);

    const getSavedPosts = async () => {
        let comms = [];
        try{
            const res = await axios.get("http://localhost:5000/api/posts/getsavedposts", {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("login_token"),
                },
            }).catch(function (error) {
                if (error.response.status === 401) {
                    navigate("/signin");
                    return;
                }
            });
            for (var i=0; i < res.data.length; i++){
              let innercomms = [];
              for (var j = 0; j < res.data[i].comments.length; j++) {
                try {
                  const res2 = await axios.post("http://localhost:5000/api/posts/onecomment", {
                    commentid: res.data[i].comments[j]
                  }, {
                    headers: {
                      "Content-Type": "application/json",
                      "x-auth-token": localStorage.getItem("login_token"),
                    },
                  }).catch(function (error) {
                    if (error.response.status === 401) {
                      window.alert("Unauthorized");
                      navigate("/signin");
                      return;
                    }
                  }
                  );
                  console.log(res2);
                  if (res2.status === 200) {
                      try {
                        const res3 = await axios.post("http://localhost:5000/api/users/oneuser", {
                          userid: res2.data.user
                        }, {
                          headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem("login_token"),
                          },
                        }).catch(function (error) {
                          if (error.response.status === 401) {
                            window.alert("Unauthorized");
                            navigate("/signin");
                            return;
                          }
                        }
                        );
                        console.log(res3);
                        if (res3.status === 200) {
                          console.log("Success");
                          console.log(res3.data);
                          res2.data.username = res3.data.username;
                        }
                        else {
                          console.log("Error");
                          navigate("/");
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    }
                    console.log("Success");
                    console.log(res2.data);
                    innercomms.push(res2.data);  
                } catch (err) {
                  console.log(err);
                }
      
      
              }
              comms.push(innercomms);
            }
            console.log(res);
            if (res.status === 200) {
                console.log("Success");
                console.log(res.data);
                setSavedPosts(res.data);
                setComments(comms);
            }
            else {
                console.log("Error");
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };
    for (var i=0; i<savedPosts.length; i++)
    {
      savedPosts[i].comments = comments[i];
    }

    const getCurrentUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/users", {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("login_token"),
            },
          }).catch(function (error) {
            if (error.response.status === 401) {
              window.alert("Unauthorized");
              navigate("/signin");
              return;
            }
          }
          );
          console.log(res);
          if (res.status === 200) {
            console.log("Success");
            console.log(res.data);
            setCurrUser(res.data);
          }
          else {
            console.log("Error");
            navigate("/");
          }
        }
        catch (err) {
          console.log(err);
        }
      };
    
    async function removeSavedPost(postid) {
      try {
        const res = await axios.post("http://localhost:5000/api/posts/removesavedpost", {
          postid: postid
        }, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("login_token"),
          },
        }).catch(function (error) {
          if (error.response.status === 401) {
            window.alert("Unauthorized");
            navigate("/signin");
            return;
          }
        }
        );
        console.log(res);
        if (res.status === 200) {
          console.log("Success");
          console.log(res.data);
          window.alert("Post removed from saved posts");
          getSavedPosts();
          window.location.reload();
        }
        else {
          console.log("Error");
          navigate("/");
        }
      }
      catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
        getSavedPosts();
        getCurrentUser();
    }, []);
    return (
        <div>
        <Typography variant="h4" component="div" gutterBottom>
          Saved Posts
        </Typography>
        
        <Box sx={{ width: '100%', typography: 'body1' }}>
        { 

          (savedPosts.map((post) => (
            <div>
              <Card variant="outlined" sx={{ minWidth: 137 }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {post.username}
              </Typography>
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                Subgreddiit: {post.sub}
              </Typography>
              <Typography variant="h5" component="div" >
                {post.text}
              </Typography>
              
              <Button size="medium" color="success">
                {
                  (post.upvotes.includes(curr_user._id)) ? <ThumbUpIcon></ThumbUpIcon> : <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
                }
              </Button>
              {post.upvotes.length - post.downvotes.length}
              <Button size="medium" color="error">
                {
                  (post.downvotes.includes(curr_user._id)) ? <ThumbDownAltIcon></ThumbDownAltIcon> : <ThumbDownOffAltIcon></ThumbDownOffAltIcon>
                }
              </Button>
              
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {post.comments.length} Comments
              </Typography>
              {
                (post.comments.map((comment) => (
                  <div>
                    <Typography sx={{ mb: 1.5 }}>
                      {comment.username}: {comment.text}
                    </Typography>
                  </div>
                )))
              }
              <CardActions>
              <Button size="medium" variant="contained" color="error" onClick={() => removeSavedPost(post._id)}>REMOVE SAVED POST</Button>
              </CardActions>
              </Card>
              
            </div>
    
          
          )))
        }
        </Box>
        </div>
      );

}

export default SavedPosts;