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
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Box, Checkbox, Chip, Menu, MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { border, margin } from "@mui/system";
import Fuse from "fuse.js";

function SubGreddiitsPage(){
const navigate = useNavigate();
const [data, setData] = React.useState([]);
const [all, setAll] = React.useState([]);
const [unfollowed, setUnfollowed] = React.useState([]);
const [searchQuery, setSearchQuery] = React.useState("");
const [searchData, setSearchData] = React.useState([]);
const [searchUnfollowed, setSearchUnfollowed] = React.useState([]);
const [currUser, setCurrUser] = React.useState([]);
const [nameAscSort, setNameAscSort] = React.useState(false);
const [nameDescSort, setNameDescSort] = React.useState(false);
const [userSort, setUserSort] = React.useState(false);
const [dateSort, setDateSort] = React.useState(false);
const [creationDates, setCreationDates] = React.useState([]);
const [followedDates, setFollowedDates] = React.useState([]);
const [unfollowedDates, setUnfollowedDates] = React.useState([]);
const [tags, setTags] = React.useState([]);
const [selectedTags, setSelectedTags] = React.useState([]);


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

/**
 * @description This function is used to get all the subgreddiits
 */
const getAll = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/subgreddiits/allsubs", {
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("login_token"),
            },
        }).catch(function (error) {
            if (error.response.status === 401) {
                navigate("/signin");
                return;
            }
        }
        );
        console.log(res);
        if (res.status === 200) {
            console.log("Success");
            console.log(res.data);
            setAll(res.data);
        }
        else {
            console.log("Error");
            navigate("/");
        }

        try {
          const res2 = await axios.get("http://localhost:5000/api/subgreddiits/getallcreationdates", {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("login_token"),
            },
          }).catch(function (error) {
            if (error.response.status === 401) {
              navigate("/signin");
              return;
            }
          }
          );
          console.log(res2);
          if (res2.status === 200) {
            console.log("Success");
            console.log(res2.data);
            setCreationDates(res2.data);
            for (let i = 0; i < res.data.length; i++) {
              let date = new Date(res2.data[i].creationdate);
              res.data[i].createdAt = date.toDateString();
              console.log(res.data[i].createdAt);
            }
            console.log(res.data);
            setAll(res.data);
          }
          else {
            console.log("Error");
            navigate("/");
          }
        } catch (err) {
          console.log(err);
        }
    }
    catch (err) {
        console.log(err);
    }

  

  console.log(creationDates);
  // for (let i = 0; i < all.length; i++) {
  //   let date = new Date(creationDates[i].creationdate);
  //   all[i].createdAt = date.toDateString();
  //   console.log(all[i].createdAt);
  // }

  console.log(all);
};

/**
 * @description This function is used to get all the subgreddiits that the user is following
 */
const getData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/subgreddiits/allfollowedsubs", {
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
      setData(res.data);

    }
    else
    {
      console.log("Error");
      navigate("/");
    }

    try {
      const res2 = await axios.get("http://localhost:5000/api/subgreddiits/getfollowedcreationdates", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).catch(function (error) {
        if (error.response.status === 401) {
          navigate("/signin");
          return;
        }
      }
      );
      console.log(res2);
      if (res2.status === 200) {
        console.log("Success");
        setFollowedDates(res2.data);
        for (let i = 0; i < res.data.length; i++) {
          let date = new Date(res2.data[i].creationdate);
          res.data[i].createdAt = date.toDateString();
          console.log(res.data[i].createdAt);
        }
        console.log(res.data);
        setData(res.data);
        setSearchData(res.data);
      }
      else {
        console.log("Error");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }
  catch (err) {
    console.log(err);
  }

  

  console.log(followedDates);
  // for (let i = 0; i < data.length; i++) {
  //   console.log(followedDates[i].creationdate)
  //   let date = new Date(followedDates[i].creationdate);
  //   data[i].createdAt = date.toDateString();
  //   console.log(data[i].createdAt);
  // }
  // console.log("Data after pushing dates:", data);

  console.log(data);
};



/**
* @description This function is used to send join requests to the subgreddiits
 */
async function sendJoinReq(subname){
  console.log(subname);
  try{
    const subdetail = await axios.post("http://localhost:5000/api/subgreddiits/onesub", {
      name: subname
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
    console.log(subdetail);
    if(subdetail.status===200){
      console.log(subdetail.data.left_users);
      if(subdetail.data.left_users.includes(currUser._id)){
        window.alert("You have left this subgreddiit. You cannot rejoin it");
        window.location.reload();
        return;
      }
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const res = await axios.post("http://localhost:5000/api/subgreddiits/sendjoinreq", {
      name: subname
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
      window.alert("Join request sent successfully")
      window.location.reload();
    }
    else
    {
      console.log("Error");
      navigate("/");
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description This function is used to leave the subgreddiits
 */
async function leaveSub(subname){
  console.log(subname);
  try {
    const res = await axios.post("http://localhost:5000/api/subgreddiits/leave", {
      name: subname
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
      window.alert("Left subgreddiit successfully")
      window.location.reload();
    }
    else
    {
      console.log("Error");
      navigate("/");
    }
  } catch (err) {
    console.log(err);
  }
}

const handleTagsChange = (event) => {
  setSelectedTags(event.target.value);
};

// const getTags = () => {
//   let posttags = [];
//   for(let i=0;i<searchData.length;i++){
//     for (let j = 0; j < searchData[i].tags.length; j++) {
//       if(!posttags.includes(data[i].tags[j])){
//         posttags.push(data[i].tags[j]);
//       }
//     }
//   }
//   console.log("Tags:" ,posttags);
//   for(let i=0;i<searchUnfollowed.length;i++){
//     for (let j = 0; j < searchUnfollowed[i].tags.length; j++) {
//       if(!posttags.includes(unfollowed[i].tags[j])){
//         posttags.push(unfollowed[i].tags[j]);
//       }
//     }
//   }
//   console.log("Tags:" ,posttags);
//   setTags(posttags);
// };

React.useEffect(()=>{
  let temp =[];
  for(let i=0;i<all.length;i++){
      let flag = 0;
      for(let j=0;j<data.length;j++){
          if(all[i].name===data[j].name){
              flag = 1;
              break;
          }
      }
      if(flag===0){
          temp.push(all[i]);
      }
  }
  setUnfollowed(temp);
  setSearchUnfollowed(temp);
  console.log("Unfollowed:",unfollowed);
  let posttags = [];
  for(let i=0;i<all.length;i++){
    for (let j = 0; j < all[i].tags.length; j++) {
      if(!posttags.includes(all[i].tags[j])){
        posttags.push(all[i].tags[j]);
      }
    }
  }
  console.log("Tags:" ,posttags);
  setTags(posttags);
},[data,all]);

const sortAsc = () => {
  data.sort(
    function(a,b){
      if(a.name.toLowerCase()<b.name.toLowerCase()) { return -1; }
      if(a.name.toLowerCase()>b.name.toLowerCase()) { return 1; }
      return 0;
    }
  )
  unfollowed.sort(
    function(a,b){
      if(a.name.toLowerCase()<b.name.toLowerCase()) { return -1; }
      if(a.name.toLowerCase()>b.name.toLowerCase()) { return 1; }
      return 0;
    }
  )
  console.log(data);
  setData(data);
  setUnfollowed(unfollowed);
};

const sortDesc = () => {
  data.sort(
    function(a,b){
      if(a.name.toLowerCase()<b.name.toLowerCase()) { return 1; }
        if(a.name.toLowerCase()>b.name.toLowerCase()) { return -1; }
        return 0;
      }
    )
    unfollowed.sort(
      function(a,b){
        if(a.name.toLowerCase()<b.name.toLowerCase()) { return 1; }
        if(a.name.toLowerCase()>b.name.toLowerCase()) { return -1; }
        return 0;
      }
    )
    console.log(data);
    setData(data);
    setUnfollowed(unfollowed);
};

const sortDate = () => {
  data.sort(
    function(a,b){
      if(a.createdAt<b.createdAt) { return -1; }
      if(a.createdAt>b.createdAt) { return 1; }
      return 0;
    }
  )
  unfollowed.sort(
    function(a,b){
      if(a.createdAt<b.createdAt) { return -1; }
      if(a.createdAt>b.createdAt) { return 1; }
      return 0;
    }
  )
  console.log(data);
  setData(data);
  setUnfollowed(unfollowed);
};

const sortUser = () => {
  data.sort(
    function(a,b){
      if(a.followers.length<b.followers.length) { return 1; }
      if(a.followers.length>b.followers.length) { return -1; }
      return 0;
    }
  )
  unfollowed.sort(
    function(a,b){
      if(a.followers.length<b.followers.length) { return 1; }
      if(a.followers.length>b.followers.length) { return -1; }
      return 0;
    }
  )
  console.log(data);
  setData(data);
  setUnfollowed(unfollowed);
};

const search = () => {
  if(!searchQuery){
    setSearchData(data);
    setSearchUnfollowed(unfollowed);
    return;
  }
  const fuse = new Fuse(data, {
    keys: ["name"],
  });
  const fuse2 = new Fuse(unfollowed, {
    keys: ["name"],
  });
  const result = fuse.search(searchQuery);
  const result2 = fuse2.search(searchQuery);
  const matches = [];
  const unfollowedmatches = [];

  if (result.length) {
    result.forEach(({ item }) => {
      matches.push(item);
    });
    setSearchData(matches);
  } else {
    setSearchData([]);
  }

  if (result2.length) {
    result2.forEach(({ item }) => {
      unfollowedmatches.push(item);
    }
    );
    setSearchUnfollowed(unfollowedmatches);
  } else {
    setSearchUnfollowed([]);
  }
};

React.useEffect(()=>{
  if(localStorage.getItem("login_token")==="null"){
      navigate("/signin");
  }
  else{
      getData();
      getAll();
      getCurrentUser();
      search();
  }
},[]);

return(

    <Grid container spacing={1}>
    <Grid item xs={12}>
      <h3>SubGreddiits Page</h3>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="h6" component="div"> SORT: </Typography>
      <Checkbox 
      checked={nameAscSort==="true"}
      onChange={(e)=>{sortAsc();setNameAscSort(e.target.checked.toString())}}
      inputProps={{ 'aria-label': 'primary checkbox' }}/>
      <label>Name Ascending</label>

      <Checkbox 
      checked={nameDescSort==="true"}
      onChange={(e)=>{sortDesc();setNameDescSort(e.target.checked.toString())}}
      inputProps={{ 'aria-label': 'primary checkbox' }}/>
      <label>Name Descending</label>

      <Checkbox
      checked={dateSort==="true"}
      onChange={(e)=>{sortDate();setDateSort(e.target.checked.toString())}}
      inputProps={{ 'aria-label': 'primary checkbox' }}/>
      <label>Date</label>

      <Checkbox
      checked={userSort==="true"}
      onChange={(e)=>{sortUser();setUserSort(e.target.checked.toString())}}
      inputProps={{ 'aria-label': 'primary checkbox' }}/>
      <label>User</label>

    </Grid>
    <Grid item xs={6}>
    <Typography variant="h6" component="div">
      Search SubGreddiits
    </Typography>
        <div>
            <input 
            placeholder="Search SubGreddiits"
            disabled={nameAscSort==="true" || userSort==="true" || dateSort==="true" || nameDescSort==="true"}
            onChange={(e)=>{setSearchQuery(e.target.value)}}/>
            <button onClick={search}>Search</button>
        </div>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h6" component="div">
        Filter SubGreddiits by Tag
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Select 
      labelId="multi-tag-label"
      id="multi-tag"
      multiple
      value={selectedTags}
      onChange={handleTagsChange}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
    >
      {tags.map((tag) => (
        <MenuItem
         key={tag} 
         value={tag} >
          {tag}
        </MenuItem>
      ))}
    </Select>
    </Grid>
    <Grid item xs={12}>
        <h4>Followed SubGreddiits</h4>
    </Grid>
    <Grid container spacing={1}>
        {        
          searchData.filter(datum => {

              if(selectedTags.length === 0){
                return datum
              }else{
                let flag = false;
                datum.tags.forEach(tag => {
                  if(selectedTags.includes(tag)){
                    flag = true;
                  }
                })
                if(flag){
                  return datum
                }
              }

        }).map((item) => (
            <Grid item xs={6}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                    <Typography variant="h5" component="div">
                        {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {item.description}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      followers: {item.followers.length}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Tags: {item.tags.map((tag)=>(
                            <Chip color="primary" label={tag} />
                        ))}
                    </Typography>
                    <Typography variant="body2">
                        Banned words: {item.banned_words.map((word)=>(
                            <Chip color="error" label={word} />
                        ))}
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="medium" 
                    onClick={()=>leaveSub(item.name)}
                    disabled={item.moderators.includes(currUser._id)}
                    >
                      LEAVE
                      </Button>
                    <Button size="medium"><Link to={"/subgreddiits/"+item.name}>VIEW</Link></Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>

    <Grid item xs={12}>
    <h4>Other SubGreddiits</h4>
    </Grid>
    <Grid container spacing={1}>
    {searchUnfollowed.filter(datum => {
              if(selectedTags.length === 0){
                return datum
              }else{
                let flag = false;
                datum.tags.forEach(tag => {
                  if(selectedTags.includes(tag)){
                    flag = true;
                  }
                })
                if(flag){
                  return datum
                }
              }
    }).map((item) => (
            <Grid item xs={6}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                    <Typography variant="h5" component="div">
                        {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {item.description}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      followers: {item.followers.length}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Tags: {item.tags.map((tag)=>(
                            <Chip color="primary" label={tag} />
                        ))}
                    </Typography>
                    <Typography variant="body2">
                      Banned words: {item.banned_words.map((word)=>(
                            <Chip color="error" label={word} />
                        ))}
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="medium" 
                    onClick={()=>sendJoinReq(item.name)}
                    disabled={item.left_users.includes(currUser._id)}
                    >
                    JOIN</Button>
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>
  </Grid>
)
    }
export default SubGreddiitsPage;