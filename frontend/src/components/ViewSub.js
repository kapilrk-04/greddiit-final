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
var executed = false;
function ViewSub() {
  console.log(useParams());
  const navigate = useNavigate();
  const { subgreddiit } = useParams();
  const [data, setData] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [curr_user, setCurrUser] = React.useState([]);
  const [following, setFollowing] = React.useState([]);
  const [followingIDS, setFollowingIDS] = React.useState([]);
  const [cpost, setCPost] = React.useState([]);
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([]);
  console.log(localStorage.getItem("login_token"));

  /**
   * @description GET CURRENT USER
   */
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

  /*
  * @description get followers of poster
  */
  const getFollowing = async () => {  
    try {
      const res = await axios.get("http://localhost:5000/api/follows/followers", {
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
        setFollowing(res.data);
        let temp = [];
        for (var i = 0; i < res.data.length; i++) {
          temp.push(res.data[i]._id);
        }
        setFollowingIDS(temp);
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


  /**
   * @description get current subgreddiit details
   */
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

  /**
   * @description get all posts of current subgreddiit
   */
  const getPosts = async () => {
    let comms = [];
    try {
      const res = await axios.post("http://localhost:5000/api/posts/getposts",{
        sub: subgreddiit
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
      for (var i = 0; i < res.data.length; i++) {
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
      if(res.status===200){
        console.log("Success");
        console.log(res.data);
        setPosts(res.data);
        console.log(comms);
        setComments(comms);

        console.log(posts);
        console.log(comments);
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
  for (var i = 0; i < posts.length; i++) {
    posts[i].comments = comments[i];
  }
  console.log(posts);
  /**
   * @description add comment
   */
  async function addComment(postid) {
    try {
      const res = await axios.post("http://localhost:5000/api/posts/comment", {
        postid: postid,
        text: comment,
        user: curr_user._id,
        sub: subgreddiit,
        upvotes: [],
        downvotes: [],
        comments: []
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
        setComment("");
        window.location.reload();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * @description upvote function
  */
  async function upvote(postid, userid) {
    console.log("p:",postid);
    console.log("u:",userid);
    try {
      const res = await axios.post("http://localhost:5000/api/posts/upvote", {
        postid: postid,
        userid: userid
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
        window.location.reload();
        getPosts();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  /**
   * @description downvote function
   */
  async function downvote(postid, userid) {
    try {
      const res = await axios.post("http://localhost:5000/api/posts/downvote", {
        postid: postid,
        userid: userid
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
        window.location.reload();
        getPosts();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async function followuser(follower, following)
  {
    try
    {
      const res = await axios.post("http://localhost:5000/api/follows/followids", {
        follower: follower,
        following: following
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
        window.alert("User followed successfully")
        window.location.reload();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    } catch (err) {
    console.log(err);
  }
}

  async function reportPost(reported, reportedtext, reportedpost){
    let reason = window.prompt("Enter the reason for reporting the post");
    if(reason === null)
    {
      return;
    }

    try{
      const res = await axios.post("http://localhost:5000/api/reports", {
        reported: reported,
        reason: reason,
        reportedtext: reportedtext,
        reportedpost: reportedpost,
        subgreddiit: subgreddiit
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
        window.alert("Post reported successfully")
        window.location.reload();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    } catch (err) {
    console.log(err);
  }
}

  async function savePost(postid){
    try{
      const res = await axios.post("http://localhost:5000/api/posts/savepost", {
        postid: postid,
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
        window.alert("Post saved successfully")
        window.location.reload();
      }
      else {
        console.log("Error");
        navigate("/");
      }
    } catch (err) {
    console.log(err);
  }
}

  React.useEffect(()=>{
    if(localStorage.getItem("login_token")==="null"){
        navigate("/signin");
    }
    else{
        console.log("Getting data");
        getData();
        getPosts();
        getCurrentUser();
        getFollowing();
    }
  },[]);



  /**
   * This is the basic box that will be used to display the subgreddiit basic details
   */
  let basicbox = []
  for (var i = 0; i < data.length; i++) {
    basicbox.push(
        <Grid container spacing={2}>
          <Grid item xs={4} md={6}>
        <img alt="icon" src={ require('./man.jfif') } width={250} height={250}/>

          </Grid>

          <Grid item xs={8} md={6}>
            <Typography variant="h4" component="div" gutterBottom>
              s/{subgreddiit}
            </Typography>

            <Typography variant="h6" component="div" gutterBottom>
              {data[i].description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={12}>
            <Button variant="contained" onClick={() => navigate(-1)} >Back</Button>
            <Button variant="contained" onClick={() => navigate("createpost")}>Create Post</Button>
          </Grid>
        </Grid>
    );
  }     

for (var i = 0; i < posts.length; i++) {
  let text = posts[i].text;
  let text2 = [];
  text = text.split(" ");
  for (var j = 0; j < text.length; j++) {
    let text3 = text[j].replace(/[^a-zA-Z ]/g, "").toLowerCase();
    if (data[0].banned_words.includes(text3)) {
      text2.push("****");
    }
    else {
      text2.push(text[j]);
    }
  }
  text2 = text2.join(" ");
  posts[i].text = text2;
}
  let index = 0;
  return (
    <div>
    <Box sx={{ width: '100%', typography: 'body1' }}>
    {basicbox}
    </Box>
    <Box sx={{ width: '100%', typography: 'body1' }}>
    {
      (posts.map((post) => (
        <div>
          <Card variant="outlined" sx={{ minWidth: 275 }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {post.username}
          </Typography>
          <Typography variant="h5" component="div" >
            {post.text}
          </Typography>
          
          <Button size="medium" color="success" onClick={() => upvote(post._id, curr_user._id)}>
            {
              (post.upvotes.includes(curr_user._id)) ? <ThumbUpIcon></ThumbUpIcon> : <ThumbUpOffAltIcon></ThumbUpOffAltIcon>
            }
          </Button>
          {post.upvotes.length - post.downvotes.length}
          <Button size="medium" color="error" onClick={() => downvote(post._id, curr_user._id)}>
            {
              (post.downvotes.includes(curr_user._id)) ? <ThumbDownAltIcon></ThumbDownAltIcon> : <ThumbDownOffAltIcon></ThumbDownOffAltIcon>
            }
          </Button>
          <Button
            size="small"
            disabled={(post.username === curr_user.username || followingIDS.includes(curr_user._id)) ? true : false}
            onClick={()=>followuser(curr_user._id, post.user)}>
            Follow User
            </Button>

          <Button
            size="small"
            disabled={(post.username === curr_user.username) ? true : false}
            onClick={() => reportPost(post.user, post.text, post._id)}
          >
            Report Post
          </Button>

          <Button
            size="small"
            disabled={(post.user === curr_user._id || curr_user.saved_posts.includes(post._id)) ? true : false}
            onClick={() => savePost(post._id)}
          >
            Save Post
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
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                COMMENT:
              </Grid>
              <Grid item xs={9}>
                <TextField
                  autoComplete="given-comment"
                  name="comment"
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                  id="comment"
                />
              </Grid>
            </Grid>
            <Button
              onClick={() => addComment(post._id, curr_user._id)}
              size="small"
              disabled={(comment === "") ? true : false}
              color="primary"
              variant="contained">
              Comment
              </Button>
          </Box>
          </Card>
        </div>

      
      )))
    }
    </Box>
    </div>
  );
  
}

export default ViewSub;