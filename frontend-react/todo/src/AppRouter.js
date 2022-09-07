import React from 'react';
import './index.css';
import App from './App';
import Login from './Login';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Kakao from './Kakao';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright '}
      indra, {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

class AppRouter extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/kakao" element={<Kakao />} />
              <Route path="/" element={<App />} />
            </Routes>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Router>
      </div>
    );
  }
}

export default AppRouter;
