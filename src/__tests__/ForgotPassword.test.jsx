import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import { Provider } from "react-redux";
import store from "../Store/store";

test("renders email input field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test("renders Send Reset Link button", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    </Provider>
  );
  expect(
    screen.getByRole("button", { name: /send reset link/i })
  ).toBeInTheDocument();
});
