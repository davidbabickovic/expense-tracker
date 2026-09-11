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

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("paid_by").value = "";  


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

            const editFormDiv = document.getElementById("edit-expense-form-div");
            editFormDiv.style.display = "flex";
            document.body.style.overflow = "hidden"
            const editForm = document.getElementById("edit-expense-form");
            editForm.querySelector("#edit-id").value = expense.id;
            editForm.querySelector("#edit-description").value = expense.description;
            editForm.querySelector("#edit-amount").value = expense.amount;
            editForm.querySelector("#edit-paid_by").value = expense.paid_by;

        });

        div.appendChild(editButton);
        div.appendChild(deleteButton);
        expensesList.appendChild(div);
        
    });


}

const editForm = document.getElementById("edit-expense-form");

editForm.addEventListener("submit", async function(event) { 

    event.preventDefault();

    const id = document.getElementById("edit-id").value;
    const description = document.getElementById("edit-description").value;
    const amount = parseFloat(document.getElementById("edit-amount").value);
    const paid_by = document.getElementById("edit-paid_by").value;

    const updatedExpense = {
        description: description,
        amount: amount,
        paid_by: paid_by
    };

    await fetch(`/expenses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedExpense)
    });

    await loadExpenses();
    const editFormDiv = document.getElementById("edit-expense-form-div");
    editFormDiv.style.display = "none";
    document.body.style.overflow = ""


});

const editFormCancelButton = document.getElementById("edit-cancel-button");

editFormCancelButton.addEventListener("click", function() {
    const editFormDiv = document.getElementById("edit-expense-form-div");
    editFormDiv.style.display = "none";
    document.body.style.overflow = ""
    
});


loadExpenses();