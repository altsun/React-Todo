import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import auth0 from "auth0-js";

import App from "./App";
import { loadTodoList } from "./actions";
import todoApp from "./reducers";
import rootSaga from "./sagas";

jest.mock("auth0-js", () => ({
  WebAuth: jest.fn(function () {
    this.authorize = jest.fn();
    this.logout = jest.fn();
    this.parseHash = jest.fn();
  })
}));

const auth = auth0.WebAuth.mock.instances[0];
const originalFetch = global.fetch;
const originalActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
let container;
let root;
let store;
let task;

beforeAll(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterAll(() => {
  global.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
});

beforeEach(() => {
  auth.authorize.mockClear();
  auth.logout.mockClear();
  auth.parseHash.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  const saga = createSagaMiddleware();
  store = createStore(todoApp, applyMiddleware(saga));
  task = saga.run(rootSaga);
});

afterEach(() => {
  act(() => root.unmount());
  task.cancel();
  container.remove();
  global.fetch = originalFetch;
});

function renderApp(path = "/") {
  return act(async () => {
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });
}

function click(selector) {
  const element = container.querySelector(selector);
  expect(element).not.toBeNull();
  act(() => element.click());
}

it("loads todos, navigates to the add form and lists the new item", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => [{ _id: "fixture", title: "Existing todo" }]
  });
  await act(async () => {
    store.dispatch(loadTodoList());
  });
  await renderApp();
  expect(container.textContent).toContain("Existing todo");

  click('a[href="/new-item"]');
  const input = container.querySelector('input[placeholder="Enter an item"]');
  expect(input).not.toBeNull();
  input.value = "   ";
  click('button[type="submit"]');
  expect(store.getState().todoList).toHaveLength(1);

  input.value = "  New synthetic todo  ";
  click('button[type="submit"]');
  expect(input.value).toBe("");
  click('a[href="/"]');
  expect(container.textContent).toContain("Existing todo");
  expect(container.textContent).toContain("New synthetic todo");
});

it("hands login to the Auth0 SDK without contacting the service", async () => {
  await renderApp();
  click("button");
  expect(auth.authorize).toHaveBeenCalledTimes(1);
});

it("handles an Auth0 callback, returns to the list and exposes logout", async () => {
  auth.parseHash.mockImplementationOnce(callback =>
    callback(null, {
      idToken: "synthetic-token",
      idTokenPayload: { email: "reader@example.invalid", exp: 4_000_000_000 }
    })
  );
  await renderApp("/callback");
  expect(auth.parseHash).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain("reader@example.invalid");
  expect(container.textContent).not.toContain("Loading user profile");
  click("button");
  expect(auth.logout).toHaveBeenCalledTimes(1);
});
