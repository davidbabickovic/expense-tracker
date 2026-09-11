console.log("JavaScript is working!");


const form = document.getElementById("expense-form");

form.addEventListener("submit", async function(event) {
    
    event.preventDefault();
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paid_by = document.getElementById("paid_by").value;

    const expense = {
        description: description,
        amount: amount,
        paid_by: paid_by
    };
    console.log(expense);

    await fetch("/expenses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    await loadExpenses();


});


async function loadExpenses() {
    const response = await fetch("/expenses");
    const expenses = await response.json();

    const expensesList = document.getElementById("expenses-list");
    expensesList.innerHTML = "";

    expenses.forEach(function(expense) {
        
        const div = document.createElement("div");

        div.classList.add("expense-card");

        div.innerHTML = `
            <h3>${expense.description}</h3>
            <p>Amount: ${expense.amount} € </p>
            <p>Paid by: ${expense.paid_by}</p>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async function() {
            const confirmed = confirm("Are you sure you want to delete this expense?");
            if (!confirmed) {
                return;
            }
            await fetch(`/expenses/${expense.id}`, {
                method: "DELETE"
            });
            await loadExpenses();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", async function() {
            const newDescription = prompt("Enter new description:", expense.description);
            if (newDescription === null) {
                return; // User cancelled the prompt
            }
            const newAmount = parseFloat(prompt("Enter new amount:", expense.amount));
            if (isNaN(newAmount)) {
                alert("Invalid amount entered.");
                return;
            }
            const newPaidBy = prompt("Enter new paid by:", expense.paid_by);
            if (newPaidBy === null) {
                return; // User cancelled the prompt
            }

            const updatedExpense = {
                description: newDescription,
                amount: newAmount,
                paid_by: newPaidBy
            };

            await fetch(`/expenses/${expense.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedExpense)
            });
            
            await loadExpenses();
            

            

        });

        div.appendChild(editButton);
        div.appendChild(deleteButton);
        expensesList.appendChild(div);
        
    });
}

loadExpenses();