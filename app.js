function ExpenseTracker() {
  const [expenses, setExpenses] = React.useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("Food");
  const [editingIndex, setEditingIndex] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateChart();
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense = { title, amount: Number(amount), category, date: new Date() };

    if (editingIndex !== null) {
      const updated = [...expenses];
      updated[editingIndex] = newExpense;
      setExpenses(updated);
      setEditingIndex(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setTitle("");
    setAmount("");
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const editExpense = (index) => {
    const ex = expenses[index];
    setTitle(ex.title);
    setAmount(ex.amount);
    setCategory(ex.category);
    setEditingIndex(index);
  };

  const monthlyTotal = expenses.reduce((sum, ex) => sum + ex.amount, 0);

  let chartInstance;
  const updateChart = () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const categoryTotals = {};

    expenses.forEach(ex => {
      categoryTotals[ex.category] = (categoryTotals[ex.category] || 0) + ex.amount;
    });

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            data: Object.values(categoryTotals)
          }
        ]
      }
    });
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="card">
        <h2>{editingIndex !== null ? "Edit Expense" : "Add Expense"}</h2>

        <input 
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input 
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>

        <button onClick={addExpense}>
          {editingIndex !== null ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      <div className="card">
        <h2>Monthly Summary: ₹{monthlyTotal}</h2>
        <canvas id="chart" height="200"></canvas>
      </div>

      <div className="card">
        <h2>Expenses</h2>
        <div className="expense-list">
          {expenses.map((ex, index) => (
            <div key={index} className="expense-item">
              <div>
                <strong>{ex.title}</strong> — ₹{ex.amount}
                <br />
                <small>{ex.category}</small>
              </div>
              <div className="expense-actions">
                <button className="edit" onClick={() => editExpense(index)}>Edit</button>
                <button onClick={() => deleteExpense(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ExpenseTracker />);
