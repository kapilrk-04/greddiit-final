import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import { Chip } from "@mui/material";


function MySubGreddiits(){
const navigate = useNavigate();
const [data, setData] = React.useState([]);

const getData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/subgreddiits/allmysubs", {
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

async function deleteSub(name, subid){
  try {
    const res = await axios.post("http://localhost:5000/api/subgreddiits/delete", {
      name: name,
      subid: subid
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
      window.alert("SubGreddiit deleted successfully")
      window.location.reload();
      getData();
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


React.useEffect(()=>{
  if(localStorage.getItem("login_token")==="null"){
      navigate("/signin");
  }
  else{
      getData();
  }
},[]);

let box = [];
for(let i=0;i<data.length;i++){
  box.push(
    <Grid item xs={6}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography variant="h5" component="div">
            {data[i].name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {data[i].description}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Tags: {data[i].tags.map((tag)=>(
                            <Chip color="primary" label={tag} />
                        ))}
          </Typography>
          <Typography variant="body2">
            Banned words: {data[i].banned_words.map((word)=>(
                            <Chip color="error" label={word} />
                        ))}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="medium" onClick={()=>deleteSub(data[i].name, data[i]._id)}>DELETE</Button>
          <Button size="medium"><Link to={"/mysubgreddiits/"+data[i].name}>VIEW</Link></Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

return(
    <Grid container spacing={1}>
    <Grid item xs={12}>
      <h3>My SubGreddiits</h3>
    </Grid>
    <Grid item xs={12}>
        <Button variant="contained"  color="inherit" size="large" sx={{fontSize: 24}}><Link to={"/mysubgreddiits/create"}>CREATE NEW SUBGREDDIIT</Link></Button>
    </Grid>
    {box}
      <Grid item xs={12}>
      </Grid>
  </Grid>
)
}

export default MySubGreddiits;