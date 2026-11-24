import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import App from "./App";
import todoApp from "./reducers";

jest.mock("./Auth", () => ({ signIn: jest.fn(), signOut: jest.fn() }));

let container;
let root;
let store;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  store = createStore(todoApp);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

function renderAt(path) {
  act(() => {
    root.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });
}

it("renders the main list with its navigation", () => {
  renderAt("/");
  expect(container.querySelector("h1").textContent).toBe("TodoList");
  expect(container.querySelector('a[href="/new-item"]').textContent).toBe(
    "+ Add New"
  );
  expect(container.querySelector("input")).toBeNull();
});

it("ignores a blank submission, saves a trimmed todo, and displays it on the list", () => {
  renderAt("/new-item");
  const input = container.querySelector("input");
  const form = container.querySelector("form");
  const submit = () =>
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  input.value = "   ";
  act(submit);
  expect(store.getState().todoList).toEqual([]);

  input.value = "  Write a regression test  ";
  act(submit);
  expect(input.value).toBe("");
  expect(store.getState().todoList).toEqual([
    expect.objectContaining({ title: "Write a regression test" }),
  ]);

  const listLink = container.querySelector('a[href="/"]');
  act(() => listLink.click());
  expect(container.querySelector(".list-group-item").textContent).toBe(
    "Write a regression test"
  );
});
