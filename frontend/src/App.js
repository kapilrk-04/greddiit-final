import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Route, Link, Routes, Navigate } from 'react-router-dom';

import Home from './components/Home';
import LogOut from './components/LogOut';
import Loading from './components/Loading';
import PageNotFound from './components/PageNotFound'
import LoginUp from './components/SignIn';
import Profile from './components/Profile';
import Followers from './components/Followers';
import Following from './components/Following';
import EditProfile from './components/EditProfile';
import MySubGreddiits from './components/MySubGreddiits';
import CreateNewSub from './components/CreateNewSub';
import ViewMySub from './components/ViewMySub';
import ViewSub from './components/ViewSub';
import SubGreddiitsPage from './components/SubGreddiitsPage';
import CreatePost from './components/CreatePost';
import SavedPosts from './components/SavedPosts';

import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/material';
import RedditIcon from '@mui/icons-material/Reddit';

function App() {
  localStorage.setItem('loading', 'false');
  return (
    <div className="App">
      <div className='menu'>

        <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" sx={{ background: '#FF5700' }}>
                <Toolbar>
                  <RedditIcon
                             size="large"
                             edge="start"
                             color="inherit"
                             aria-label="menu"
                             sx={{ mr: 2 }}
                  />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Greddiit
                  </Typography>
                  <Button color="inherit"><Link to="/">Home</Link></Button>
                  <Button color="inherit"><Link to={"/signin"}>Sign In/Sign Up</Link></Button>
                  <Button color="inherit"><Link to="/logout">Log Out</Link></Button>
                  <Button color="inherit"><Link to={"/admin/profile"}>Profile</Link></Button>
                  <Button color="inherit"><Link to={"/mysubgreddiits"}>My SubGreddiits</Link></Button>
                  <Button color="inherit"><Link to={"/subgreddiits"}>SubGreddiit Page</Link></Button>
                  <Button color="inherit"><Link to={"/savedposts"}>Saved Posts</Link></Button>
                </Toolbar>
              </AppBar>
            </Box>
      </div>

      <div className="App-intro">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/signin" element={<LoginUp />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/signup" element={<LoginUp />} />
        <Route path="/admin/profile" element={<Profile />} >
     
          {/* <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} /> */}
        </Route>
        <Route path="/admin/profile/followers" element={<Followers />} />
        <Route path="/admin/profile/following" element={<Following />} />
        <Route path="/admin/profile/edit" element={<EditProfile />} />

        <Route path="/mysubgreddiits" element={<MySubGreddiits />} />
        <Route path="/mysubgreddiits/create" element={<CreateNewSub />} />
        <Route path="/mysubgreddiits/:subgreddiit" element={<ViewMySub />} />

        <Route path="/subgreddiits" element={<SubGreddiitsPage />} />
        <Route path="/subgreddiits/:subgreddiit" element={<ViewSub />} />
        <Route path="/subgreddiits/:subgreddiit/createpost" element={<CreatePost />} />
        
        <Route path="/savedposts" element={<SavedPosts />} />
        
        <Route path="*" element={<PageNotFound />} />
        </Routes>

      </div>
    </div>
  );
}


export default App;
