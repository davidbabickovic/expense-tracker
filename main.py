
from database import add_expense, get_expenses, delete_expense, update_expense
from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi.staticfiles import StaticFiles

class Expense(BaseModel):
    
    description: str
    amount: float
    paid_by: str

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

expenses = [
    {
        "id" : 1,
        "description" : "Lidl",
        "amount" : 20.00,
        "paid_by" : "David"
    },
    {
        "id" : 2,
        "description" : "Netflix",
        "amount" : 17.99,
        "paid_by" : "Panna"
    }
]




@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        )




@app.post("/expenses")
def create_expense(expense: Expense):
    add_expense(
        expense.description,
        expense.amount,
        expense.paid_by)
    return {"message": "Expense saved successfully"}

@app.get("/expenses")
def read_expenses():
    return get_expenses()


@app.delete("/expenses/{expense_id}")
def remove_expense(expense_id: int):
    answer = delete_expense(expense_id)
    return answer



@app.put("/expenses/{expense_id}")
def edit_expense(expense_id: int, updated_expense: Expense):
    answer = update_expense(expense_id, updated_expense.description, updated_expense.amount, updated_expense.paid_by)
    return answer