import { ADD_TODO, RENDER_TODO_LIST, USER_PROFILE_LOADED } from "../actions";

const initialState = {
  todoList: []
};

export default function todoApp(state = initialState, action) {
  switch (action.type) {
    case RENDER_TODO_LIST:
      return {
        ...state,
        todoList: action.todoList
      };
    case ADD_TODO:
      let newTodoList = [
        ...state.todoList,
        {
          ...action.todoItem
        }
      ];
      return {
        ...state,
        todoList: newTodoList
      };
    case USER_PROFILE_LOADED:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
}
