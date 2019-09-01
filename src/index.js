import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { BrowserRouter } from "react-router-dom";

import todoApp from "./reducers";
import App from "./App";
import { loadTodoList } from "./actions";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(todoApp, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

store.dispatch(loadTodoList());

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
