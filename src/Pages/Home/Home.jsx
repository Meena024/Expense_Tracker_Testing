import { useEffect, useState } from "react";
import classes from "./home.module.css";
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from "../../Firebase/expenseFun";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses, setTotalExpenses } from "../../Store/expenseSlice";
import { Navigate } from "react-router-dom";

export default function Home() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    description: "",
  });

  const dispatch = useDispatch();
  const { expenses, totalAmount } = useSelector((state) => state.expenses);
  const { uid } = useSelector((state) => state.auth);

  const [expenseList, setExpenseList] = useState(expenses || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const obj = useSelector((state) => state.premium);
  const { isDarkMode, isPremium } = obj;

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const expensesObj = await getAllExpenses();
        const expenses = Object.values(expensesObj);
        dispatch(setExpenses(expenses));
        setExpenseList(Object.values(expenses));

        const totalExpenses = expenses.reduce(
          (amount, expense) => amount + +expense.amount,
          0
        );
        dispatch(setTotalExpenses(totalExpenses));
      } catch (error) {
        console.error(error.message);
      }
      setIsLoading(false);
    };

    fetchExpenses();
  }, [dispatch]);

  // useEffect(() => {
  //   fetchExpenses();
  // }, []);

  if (!uid) {
    return <Navigate to="/login" />;
  }

  // async function fetchExpenses() {
  //   setIsLoading(true);
  //   try {
  //     const expensesObj = await getAllExpenses();

  //     const expenses = Object.values(expensesObj);

  //     dispatch(setExpenses(expenses));

  //     setExpenseList(Object.values(expenses)); // Ensure expenses are set correctly

  //     const totalExpenses = expenses.reduce(
  //       (amount, expense) => amount + +expense.amount,
  //       0
  //     );

  //     dispatch(setTotalExpenses(totalExpenses));
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  //   setIsLoading(false);
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateExpense(formData.id, formData);

        const updatedExpenses = expenseList.map((expense) => {
          if (expense.id === formData.id) {
            return { ...expense, ...formData };
          }
          return expense;
        });

        setExpenseList(updatedExpenses);
        setIsEditing(false);
      } else {
        const id = await addExpense(formData);
        setExpenseList([...expenseList, { ...formData, id }]);
      }

      if (totalAmount <= 1000) {
        alert(
          "You have reached your monthly expense limit. Upgrade to Premium to continue."
        );
      }

      dispatch(setTotalExpenses(totalAmount + +formData.amount));

      setFormData({ amount: "", category: "Food", description: "" });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdate = async (expense) => {
    setIsEditing(true);
    setFormData(expense);
  };

  const handleCancelEditing = async () => {
    setIsEditing(false);
    setFormData({ amount: "", category: "Food", description: "" });
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);

      const amount = expenseList.find(
        (expense) => expense.id === expenseId
      ).amount;

      const updatedExpenses = expenseList.filter(
        (expense) => expense.id !== expenseId
      );
      setExpenseList(updatedExpenses);

      dispatch(setTotalExpenses(totalAmount - +amount));
    } catch (err) {
      console.log(err.message);
    }
  };

  const downloadCSV = () => {
    const csvRows = [
      ["Amount", "Category", "Description"],
      ...expenseList.map((expense) => [
        expense.amount,
        expense.category,
        expense.description,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section
      className={`${classes.container} ${isDarkMode ? classes.darkMode : ""}`}
      // className={`${classes.container} ${isDarkMode && classes.darkMode}`}
    >
      <section>
        <form
          className={`${classes.formController} ${
            isDarkMode ? classes.darkMode : ""
          }`}
          // className={`${classes.formController} ${
          //   isDarkMode && classes.darkMode
          // }`}
          id="expenseForm"
          onSubmit={handleSubmit}
        >
          <div className="inputs">
            <div className={classes.row}>
              <div className={classes.inputController}>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              <div className={classes.inputController}>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
            </div>
          </div>
          <div className={classes.inputController}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className={classes.buttonGroup}>
            <button type="submit" className={classes.submit}>
              {isEditing ? "Update" : "Submit"}{" "}
            </button>
            {isEditing && (
              <button
                type="button"
                className={classes.cancel}
                onClick={handleCancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section>
        {isLoading && <p>Please wait...</p>}

        {expenseList.length > 0 && (
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseList.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>
                    <div className={classes.buttonGroup}>
                      <button
                        className={classes.edit}
                        onClick={() => handleUpdate(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className={classes.delete}
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total Expenses</td>
                <td>{totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {!(expenseList.length > 0) && <p>No expenses found.</p>}
        {isPremium && (
          <button onClick={downloadCSV} className={classes.downloadButton}>
            Download CSV
          </button>
        )}
      </section>
    </section>
  );
}
