import React from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";
import Jumbotron from "react-bootstrap/Jumbotron";
import Todo from "./Todo";

const TodoList = ({ todoList }) => (
  <Jumbotron>
    <ListGroup>
      {todoList.map((todo, index) => (
        <Todo key={index} {...todo} />
      ))}
    </ListGroup>
  </Jumbotron>
);

TodoList.propTypes = {
  todoList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default TodoList;
