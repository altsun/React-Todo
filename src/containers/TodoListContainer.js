import { connect } from 'react-redux';
import TodoList from '../components/TodoList';

const mapStateToProps = state => {
  return {
    todoList: state.todoList
  };
};

export default connect(mapStateToProps)(TodoList);