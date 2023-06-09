import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { teal } from '@mui/material/colors';
import './Profile.css';
import axios from 'axios';


const name="John Doe";
function createData(col, val){
    return { col, val };
}


export default function Profile() {
    console.log("Profile")
    console.log(localStorage.getItem("login_token"));
    const navigate = useNavigate();
    //const [loading, setLoading] = React.useState(0);
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [age, setAge] = React.useState("");
    const [posts, setPosts] = React.useState("");
    const [followers, setFollowers] = React.useState(Array);
    const [following, setFollowing] = React.useState("");
    const [phone, setPhone] = React.useState("");
    //problem : this doesn't nav back to signin page
    useEffect(() => {
      if(localStorage.getItem("login_token")==="null"){
        navigate("/signin");
      }
    }, []);

    /**
     * Get user details
     */
    const getDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
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
        
      try {
        const pcount = await axios.get("http://localhost:5000/api/posts/countposts", {
          headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("login_token"),
          },
        });
        setPosts(pcount.data);
        } catch (error) {
          console.log("Error:", error);
        }

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
          //setFollowers(res.data.followers);
          // setFollowing(res.data.following);
          setPhone(res.data.phone);
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
     * Get follower count
     */

    const getFollowerCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/follows/followerscount", {
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
          setFollowers(res.data);
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

    /**
     * Get following count
     */
    const getFollowingCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/follows/followingcount", {
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
          setFollowing(res.data);
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

    
    useEffect(() => {
        localStorage.setItem('loading', 'true');
        console.log("getdetails useEffect called")
        getDetails();
        console.log("getFollowerCount useEffect called")
        getFollowerCount();
        console.log("getFollowingCount useEffect called")
        getFollowingCount();
        localStorage.setItem('loading', 'false');


    }, []);

    useEffect(() => {
      if(localStorage.getItem("loading")==="true"){
        navigate("/loading")
      }
    })

    const rows = [
      createData("Name", firstname+" "+lastname),
      createData("Username", username),
      createData("Mail", email),
      createData("Age", age),
      createData("No.of posts+comments", posts),
  
  ];
    return (
        <div className="profile">
            
            <Grid container spacing={1} justify="center" display="flex">
                <Grid item xs={12}>
                <h2>{firstname} {lastname}({username})</h2>
                </Grid>

                <Grid item xs={3}>
                </Grid>

                <Grid item xs={4.5}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <h3>Followers: </h3>
                    <Button variant="text"  color="secondary" size="large" sx={{fontSize: 24}}><Link to={"/admin/profile/followers"}>{followers}</Link></Button>
                </div>  
                </Grid>

                <Grid item xs={3}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <h3>Following: </h3>
                    <Button variant="text"  color="secondary" size="small" sx={{fontSize: 24}}><Link to={"/admin/profile/following"}>{following}</Link></Button>
                </div>  
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained"  color="inherit" size="small" sx={{fontSize: 24}} component={Link}><Link to={"/admin/profile/edit"}>EDIT PROFILE</Link></Button>

                </Grid>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" fontSize="90pt">
                {row.col}
              </TableCell>
              <TableCell align="right">{row.val}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>    


                
            </Grid>


        </div>


    );
}