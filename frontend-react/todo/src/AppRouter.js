import React from 'react';
import './index.css';
import App from './App';
import Login from './Login';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { Container, Grid, Link } from '@material-ui/core';
import Kakao from './Kakao';
import { API_NAME, SWAGGER_URL } from './app-config';

function Copyright() {
  return (
    <Container maxWidth="xs" style={{ textAlign: 'center' }}>
      <Grid justifyContent="space-between" container>
        <Grid item>
          <Link href="http://todo-springboot.indralight.net:3000">
            springboot
          </Link>
        </Grid>
        <Grid item>
          <Link href="http://todo-nodejs.indralight.net:3000">nodejs</Link>
        </Grid>
        <Grid item>
          <Link href="http://todo-aspnet.indralight.net:3000">aspnet</Link>
        </Grid>
      </Grid>
      <Link href={SWAGGER_URL} target="_blank">
        Swagger - {API_NAME}
      </Link>
    </Container>
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
