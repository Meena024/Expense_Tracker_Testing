import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "../Pages/Auth/Login";
import store from "../Store/store";
import { signIn } from "../Firebase/authFun";
import { setUid } from "../Store/authSlice";

jest.mock("../Firebase/authFun");
jest.mock("../Store/authSlice", () => ({
  setUid: jest.fn((uid) => ({ type: "auth/setUid", payload: uid })),
  //   setUid: jest.fn(),
}));

beforeAll(() => {
  window.alert = jest.fn();
});

test("renders head line", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test("renders email field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test("renders password field", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test("renders login button", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
});

test("handles form submission", async () => {
  window.alert = jest.fn();
  signIn.mockResolvedValue("fake-uid");

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  const form = screen.getByTestId("login-form");

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "password123" },
  });

  fireEvent.submit(form);

  await waitFor(() => {
    expect(signIn).toHaveBeenCalledWith("test@example.com", "password123");
    expect(setUid).toHaveBeenCalledWith("fake-uid");
  });

  expect(screen.queryByText(/sending request/i)).not.toBeInTheDocument();
});

test("renders Login component and handles form submission", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  // Check if email and password input fields are rendered
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const loginButton = screen.getByRole("button", { name: /sign up/i });

  //* Assert
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();

  //* Act...
  // Simulate user input
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  // Simulate form submission
  fireEvent.click(loginButton);

  //* Assert
  // Check if the inputs reflect the entered values
  expect(emailInput.value).toBe("test@example.com");
  expect(passwordInput.value).toBe("password123");
});
