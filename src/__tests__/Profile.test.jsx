import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Profile from "../Pages/Profile/Profile";
import { getUserProfile, updateUserProfile } from "../Firebase/authFun";

// Mock the Firebase auth functions
jest.mock("../Firebase/authFun", () => ({
  getUserProfile: jest.fn(() => ({
    displayName: "Test User",
    photoURL: "http://example.com/photo.jpg",
  })),
  updateUserProfile: jest.fn((name, url) => ({
    type: "profile/update",
    payload: { name, url },
  })),
}));

// jest.mock("../Firebase/authFun", () => ({
//   getUserProfile: jest.fn(() =>
//     Promise.resolve({
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//     })
//   ),
//   updateUserProfile: jest.fn(() => Promise.resolve({ success: true })),
// }));

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    getUserProfile.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<Profile />);

    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });

  test("fetches and displays user profile data", async () => {
    getUserProfile.mockResolvedValue({
      displayName: "John Doe",
      photoURL: "http://example.com/photo.jpg",
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("http://example.com/photo.jpg")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/please wait/i)).not.toBeInTheDocument();
  });

  test("displays alert if fields are empty on submit", async () => {
    getUserProfile.mockResolvedValue({
      displayName: "",
      photoURL: "",
    });

    render(<Profile />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /update/i })
      ).toBeInTheDocument();
    });

    // Mock window.alert
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(window.alert).toHaveBeenCalledWith("Please enter all fields");
  });

  test("calls updateUserProfile and shows success alert on valid form submit", async () => {
    getUserProfile.mockResolvedValue({
      displayName: "Jane",
      photoURL: "http://example.com/jane.jpg",
    });

    updateUserProfile.mockResolvedValue();

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    });

    // Mock alert
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByLabelText(/profile photo url/i), {
      target: { value: "http://example.com/jane-new.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        "Jane Smith",
        "http://example.com/jane-new.jpg"
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Profile updated successfully!"
      );
    });
  });

  test("handles getUserProfile failure gracefully", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    getUserProfile.mockRejectedValue(new Error("Failed to fetch"));

    render(<Profile />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch");
    });

    consoleErrorSpy.mockRestore();
  });
});
