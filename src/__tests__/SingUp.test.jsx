import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import SingUp from "../Pages/Auth/SingUp";
import store from "../Store/store";

test("renders email input field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SingUp />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test("renders password input field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SingUp />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();

  //   const passwordFields = screen.getAllByPlaceholderText(/password/i);
  //   expect(passwordFields).toHaveLength(2);

  //   expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument(); error
});

test("renders confirm password input field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SingUp />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
});

test("renders Sign Up button", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SingUp />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
});
