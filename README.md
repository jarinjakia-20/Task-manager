#  Task Manager CRUD API (In-Memory)

This is a simple Task Manager backend application built using Node.js and Express.js.
It allows users to perform basic CRUD operations (Create, Read, Update, Delete) on tasks using in-memory storage.

##  Features

* Create new tasks
* View all tasks
* View a specific task by ID
* Update task details (title, description, status)
* Delete tasks
* Filter tasks by status
* Search tasks by keyword
* Sort tasks by creation date
* Input validation and error handling


##  Installation & Setup
```
npm install
```
Run the server:
```
node app.js
```
Server will start at:
```
http://localhost:3000
```

##  API Endpoints

###  Get all tasks

```
GET /tasks
```
Optional query parameters:

* `status` → filter by status
* `keyword` → search in title/description
* `order` → sort by date (`asc` or `desc`)

###  Get a single task

```
GET /tasks/:id
```

###  Create a task

```
POST /tasks
```
Body (JSON):

```
{
  "title": "Learn Node.js",
  "description": "Practice CRUD API",
  "status": "To Do"
}
```

###  Update a task

```
PATCH /tasks/:id
```

###  Delete a task

```
DELETE /tasks/:id
```

##  Important Notes

* This project uses in-memory storage, so all data will be lost when the server restarts.
* No database is used in this version.


## 📌 Future Improvements

* Connect to a real database (MySQL / MongoDB)
* Add user authentication
* Implement role-based access control
* Convert to MVC architecture
