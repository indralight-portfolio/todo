import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import {
  Paper,
  List,
  Container,
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import './App.css';
import { call, signout } from './service/ApiService';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
    };
  }

  componentDidMount() {
    call('/todo', 'GET', null).then((response) => {
      const nick = localStorage.getItem('NICK');
      this.setState({ items: response.data, loading: false, nick: nick });
    });
  }

  add = (item) => {
    call('/todo', 'PUT', item).then((response) => {
      this.setState({ items: response.data });
    });
  };

  delete = (item) => {
    call('/todo', 'DELETE', item).then((response) => {
      this.setState({ items: response.data });
    });
  };

  update = (item) => {
    call('/todo', 'PATCH', item).then((response) => {
      this.setState({ items: response.data });
    });
  };

  render() {
    var todoItems = this.state.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {this.state.items.map((item, idx) => (
            <Todo
              item={item}
              key={item.id}
              delete={this.delete}
              update={this.update}
            />
          ))}
        </List>
      </Paper>
    );

    var navigationBar = (
      <AppBar position="static">
        <Toolbar>
          <Grid justifyContent="space-between" container>
            <Grid item>
              <Typography variant="h6">오늘의 할일</Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" onClick={signout}>
                로그아웃
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );

    var todoListPage = (
      <div>
        {navigationBar} {/* 네비게이션 바 렌더링 */}
        <h1>{this.state.nick} 님, 안녕하세요.</h1>
        <Container maxWidth="md">
          <AddTodo add={this.add} />
          <div className="TodoList">{todoItems}</div>
        </Container>
      </div>
    );

    var loadingPage = <h1>로딩중...</h1>;

    var content = loadingPage;

    if (!this.state.loading) {
      content = todoListPage;
    }

    return <div className="App">{content}</div>;
  }
}

export default App;
