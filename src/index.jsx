import React from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
