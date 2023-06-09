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
import axios from 'axios';
function Followers() {
  const navigate = useNavigate();
  
  const [data, setData] = React.useState([]);
  
  async function removeFollower(follower, following){
    try {
      const res = await axios.post("http://localhost:5000/api/follows/delete", {
        follower: follower,
        following: following
      }, {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("login_token"),
        },
  
      }).catch ( function (error)
      {
        if (error.response.status === 401)
        {
          window.alert("Error");
          navigate("/signin");
          return;
        }
      }
      );
      console.log(res);
      if(res.status===200){
        window.alert("Follower Successfully removed");
        console.log(res.data);
        window.location.reload();
      }
      else
      {
        console.log("Error");
        navigate("/signin");
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/follows/followers", {
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
      });
      console.log(res);
      if(res.status===200){
        console.log("Success");
        console.log(res.data);
        setData(res.data);
      }
      else
      {
        console.log("Error");
        navigate("/signin");
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    if(localStorage.getItem("login_token")==="null"){
        navigate("/signin");
    }
    else{
        getData();
    }
  },[]);

  const box = []
  for (let i = 0; i < (data.length)-1; i++) {

    box.push(
      <Grid item xs={6}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
          <Avatar sx={{ bgcolor: deepOrange[500] ,width: 60, height: 60 }}></Avatar>
          <Typography variant="h5" component="div">
            {data[i+1].username}
          </Typography>

          <Typography variant="body2">
            {data[i+1].firstname} {data[i+1].lastname}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => removeFollower(data[i+1]._id, data[0]._id)}>Remove Follower</Button>
        </CardActions>
      </Card>
     </Grid>);
  }

  return (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <h3>Followers</h3>
    </Grid>
    {box}

      <Grid item xs={12}>
      <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
      </Grid>
  </Grid>
  

  
);
}

export default Followers;