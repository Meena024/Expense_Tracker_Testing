import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Home from "../Pages/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import * as expenseFun from "../Firebase/expenseFun"; // Mock this module
import "@testing-library/jest-dom";

// Mocks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../Firebase/expenseFun", () => ({
  getAllExpenses: jest.fn(),
  addExpense: jest.fn(),
  deleteExpense: jest.fn(),
  updateExpense: jest.fn(),
}));

describe("Home Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: { uid: "123" },
        expenses: { expenses: [], totalAmount: 0 },
        premium: { isDarkMode: false, isPremium: false },
      })
    );

    expenseFun.getAllExpenses.mockResolvedValue({});
    expenseFun.addExpense.mockResolvedValue("exp123");
  });

  test("renders form fields correctly", async () => {
    render(<Home />);
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  test("submits new expense", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test expense" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(expenseFun.addExpense).toHaveBeenCalledWith({
        amount: "100",
        category: "Food",
        description: "Test expense",
      });
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test("deletes an expense", async () => {
    const testExpenses = [
      { id: "1", amount: "50", category: "Food", description: "Lunch" },
    ];

    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: { uid: "123" },
        expenses: { expenses: testExpenses, totalAmount: 50 },
        premium: { isDarkMode: false, isPremium: false },
      })
    );

    expenseFun.getAllExpenses.mockResolvedValue({
      1: testExpenses[0],
    });

    render(<Home />);

    await waitFor(() => screen.getByText(/Delete/i));

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(expenseFun.deleteExpense).toHaveBeenCalledWith("1");
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test("downloads CSV when premium is true", async () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: { uid: "123" },
        expenses: {
          expenses: [
            {
              id: "1",
              amount: "100",
              category: "Food",
              description: "Test expense",
            },
          ],
          totalAmount: 100,
        },
        premium: { isDarkMode: false, isPremium: true },
      })
    );

    render(<Home />);

    const downloadBtn = await screen.findByText(/Download CSV/i);
    expect(downloadBtn).toBeInTheDocument();
  });
});
