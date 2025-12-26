import sqlite3
import uvicorn
from fastapi import FastAPI, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

def get_db():
    conn = sqlite3.connect('comments.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            text TEXT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

@app.get("/reviews")
async def read_index():
    return FileResponse("static/reviews.html")

@app.get("/new_reviews")
async def read_new_index():
    return FileResponse("static/reviews.html")
@app.get("/new_reviewssew")
async def second_read_new_index():
    return FileResponse("static/index.html")

@app.get("/get_reviews")
def get_comments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM comments ORDER BY date DESC")
    comments = cursor.fetchall()
    conn.close()
    return [
        {
            "id": comment["id"],
            "name": comment["name"],
            "text": comment["text"],
            "date": comment["date"]
        }
        for comment in comments
    ]

@app.post('/reviews')
async def create_comments(
    name: str = Form(...),
    review_text: str = Form(..., alias="review-text"),
):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (name, text) VALUES (?, ?)",
        (name.strip(), review_text.strip())
    )
    comment_id = cursor.lastrowid
    cursor.execute("SELECT * FROM comments WHERE id = ?", (comment_id,))
    new_comment = cursor.fetchone()
    conn.commit()
    conn.close()
    return {
        "id": new_comment["id"],
        "name": new_comment["name"],
        "text": new_comment["text"],
        "date": new_comment["date"]
    }

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def page_not_found():
    return FileResponse("static/page_not_found.html")

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)