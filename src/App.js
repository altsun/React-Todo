import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Route } from "react-router-dom";
import Callback from "./containers/Callback";
import NavigationContainer from "./containers/NavigationContainer";

import AddTodo from "./containers/AddTodo";
import TodoListContainer from "./containers/TodoListContainer";

class App extends Component {
  render() {
    return (
      <Container>
        <Row className="row">
          <Col xs={12}>
            <h1>TodoList</h1>
            <NavigationContainer />
            <Route exact path="/" component={TodoListContainer} />
            <Route exact path="/new-item" component={AddTodo} />
            <Route exact path="/callback" component={Callback} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
