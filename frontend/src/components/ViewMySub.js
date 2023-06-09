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
import { Divider } from '@mui/material';


function ViewMySub() {
  console.log(useParams());
  const navigate = useNavigate();
  const { subgreddiit } = useParams();
  const [value, setValue] = React.useState('1');
  const [sub, setSub] = React.useState("");
  const [data, setData] = React.useState([]);
  const [blocked, setBlocked] = React.useState([]);
  const [joinRequests, setJoinRequests] = React.useState([]);
  const [blockedJoinRequests, setBlockedJoinRequests] = React.useState([]);
  const [reports, setReports] = React.useState([]);

  console.log(localStorage.getItem("login_token"));

  /**
   * @description Get all the followers of the subgreddiit
   */
  const getData = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/allfollowers", {
        name: subgreddiit
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
          //"Authorization": "Bearer " + localStorage.getItem("login_token"),
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
        setData(res.data);
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
   *  @description Get all the blocked users of the subgreddiit
  */
  const getBlocked = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/allblockedusers", {
        name: subgreddiit
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
        setBlocked(res.data);
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
   * @description Get all the join requests of the subgreddiit
  */
  const getJoinRequests = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/alljoinrequests", {
        name: subgreddiit
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
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].isBlocked) {
            blockedJoinRequests.push(res.data[i]);
          }
          else {
            joinRequests.push(res.data[i]);
          }
        }
        setJoinRequests(joinRequests);
        setBlockedJoinRequests(blockedJoinRequests);
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

  const getReports = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/getreports", {
        name: subgreddiit
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
        setReports(res.data);
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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function acceptRequest(username) {
    console.log("Accepting request from: ", username);
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/acceptreq", {
        name: subgreddiit,
        _id: username
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Success");
          window.alert("Request accepted");
          getJoinRequests();
          window.location.reload();
        }
        else {
          console.log("Error");
          window.alert("Error");
          window.location.reload();
        }
      })
        .catch(function (error) {
          console.log(error);
          window.alert("Error");
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function rejectRequest(username) {
    console.log("Rejecting request from: ", username);
    try {
      const res = await axios.post("http://localhost:5000/api/subgreddiits/rejectreq", {
        name: subgreddiit,
        _id: username
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Success");
          window.alert("Request rejected");
          getJoinRequests();
          window.location.reload();
        }
        else {
          console.log("Error");
          window.alert("Error");
          window.location.reload();
        }
      })
        .catch(function (error) {
          console.log(error);
          window.alert("Error");
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function ignoreReport(reportid) {
    console.log("Ignoring report: ", reportid);
    try {
      const res = await axios.post("http://localhost:5000/api/reports/ignore", {
        reportid: reportid
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Success");
          window.alert("Report ignored");
          getReports();
          window.location.reload();
        }
        else {
          console.log("Error");
          window.alert("Error");
          window.location.reload();
        }
      })
        .catch(function (error) {
          console.log(error);
          window.alert("Error");
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function deletePost(reportid) {
    console.log("Deleting report: ", reportid);
    try {
      const res = await axios.post("http://localhost:5000/api/reports/delete", {
        reportid: reportid
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Success");
          window.alert("Post deleted");
          getReports();
          window.location.reload();
        }
        else {
          console.log("Error");
          window.alert("Error");
          window.location.reload();
        }
      })
        .catch(function (error) {
          console.log(error);
          window.alert("Error");
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function blockUser(userid, reportid) {
    console.log("Blocking user: ", userid);
    try {
      const res = await axios.post("http://localhost:5000/api/reports/blockuser", {
        userid: userid,
        reportid: reportid
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("login_token"),
        },
      }).then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log("Success");
          window.alert("User blocked");
          getReports();
          window.location.reload();
        }
        else {
          console.log("Error");
          window.alert("Error");
          window.location.reload();
        }
      })
        .catch(function (error) {
          console.log(error);
          window.alert("Error");
          window.location.reload();
        });
    } catch (err) {
      console.log(err);
    }
  }



  useEffect(() => {
    setSub(subgreddiit);
    getData();
    console.log("Blocked: ", blocked)
    getBlocked();
    getJoinRequests();
    getReports();
  }, []);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList variant='fullWidth' onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Users" value="1" />
            <Tab label="Joining Requests" value="2" />
            <Tab label="Stats" value="3" />
            <Tab label="Reported" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">

        <Typography variant="h4" component="div">
            {subgreddiit}
        </Typography>

        <Typography variant="h6" component="div">
            Users
        </Typography>

        <Grid container spacing={2}>
            {data.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {item.username}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>

        <Typography variant="h6" component="div">
            Blocked Users
        </Typography>

        <Grid container spacing={2}>
            {blocked.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ minWidth: 275 }}>
                   <CardContent>
                            <Typography sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="h6" component="div">
                                {item.username}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </TabPanel>


        <TabPanel value="2">

          <Typography variant="h4" component="div">
            JOIN REQUESTS
          </Typography>

          <Grid container spacing={2}>
            { joinRequests.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {item.username}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="success" size="small" onClick={()=>acceptRequest(item._id)}>Accept</Button>
                    <Button color="error" size="small" onClick={()=>rejectRequest(item._id)}>Reject</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

            
           <Typography variant="h4" component="div">
              JOIN REQUESTS FROM BLOCKED USERS
          </Typography>

          <Grid container spacing={2}>
            {blockedJoinRequests.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {item.username}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="success" size="small" onClick={()=>acceptRequest(item._id)}>Unblock User and Accept</Button>
                    <Button color="error" size="small" onClick={()=>rejectRequest(item._id)}>Reject</Button>
                  </CardActions>
                </Card>
              </Grid>
      
            ))}

          </Grid>


        </TabPanel>


        <TabPanel value="3">
          STATS
            </TabPanel>

        <TabPanel value="4">
          REPORTED
          <Grid container spacing={2}>
            {reports.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                     Reported By: {item.reporter}
                    </Typography>
                    <Divider></Divider>
                    <Typography variant="h6" component="div">
                     Reported User: {item.reported}
                    </Typography>
                    <Divider></Divider>
                    <Typography variant="h6" component="div">
                      Reason: {item.reason}
                    </Typography>
                    <Divider></Divider>
                    <Typography variant="h6" component="div">
                      Content: {item.text}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                    size="small" disabled={item.isIgnored}
                    onClick={()=>blockUser(item.reportedid,item._id)}
                    >
                      BLOCK USER
                    </Button>

                    <Button 
                    size="small" disabled={item.isIgnored}
                    onClick={()=>deletePost(item._id)}
                    >
                      DELETE POST
                    </Button>

                    <Button 
                    size="small"
                    onClick={()=>ignoreReport(item._id)}
                    >
                      IGNORE
                    </Button>
                    </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>


      </TabContext>
    </Box>
  );
  
}

export default ViewMySub;