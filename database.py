import sqlite3

connection = sqlite3.connect("expenses.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    paid_by TEXT NOT NULL
)
""")


connection.commit()
cursor.execute("SELECT * FROM expenses")
rows = cursor.fetchall()
for row in rows:
    print(row)
connection.close()


def add_expense(description, amount, paid_by):
    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO expenses (description, amount, paid_by)
        VALUES (?, ?, ?)
    """, (description, amount, paid_by))
    connection.commit()
    connection.close()

def get_expenses():
    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()
    cursor.execute("""
    SELECT * FROM expenses
    ORDER BY id DESC
    
    """)
    rows = cursor.fetchall()
    expenses = []
    for row in rows:
        expense = {
            "id": row[0],
            "description": row[1],
            "amount": row[2],
            "paid_by": row[3]
        }
        expenses.append(expense)
    connection.close()
    return expenses

def delete_expense(expense_id):
    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    deleted_rows = cursor.rowcount
    connection.commit()
    connection.close()
    if deleted_rows == 0:
        return {"message": f"No expense found with id {expense_id}."}
    else :
        return {"message": f"Expense with id {expense_id} has been deleted."}


def update_expense(expense_id, description, amount, paid_by):
    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE expenses
        SET description = ?, amount = ?, paid_by = ?
        WHERE id = ?
    """, (description, amount, paid_by, expense_id))
    updated_rows = cursor.rowcount
    connection.commit()
    connection.close()
    if updated_rows == 0:
        return {"message": f"No expense found with id {expense_id}."}
    else:
        return {"message": f"Expense with id {expense_id} has been updated."}