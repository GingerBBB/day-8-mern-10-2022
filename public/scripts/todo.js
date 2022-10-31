const newTodoForm = document.getElementById('newTodoForm')
const message = document.getElementById('message')
const deleteButtons = document.getElementsByClassName("deleteButton")
const editButtons = document.getElementsByClassName('editButton')

const postNewTodo = async (data) => {
    try {
        const response = await fetch('http://localhost:3500/todos/todos', {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(data)
        })

        console.log(response)
        
    } catch (error) {
        console.log(error)
    }
}

const getAllTodos = async () => {
    try {
        const response = await fetch('http://localhost:3500/todos/todos')
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

newTodoForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(e.target)
    const formData = new FormData(e.target)
    const formProps = Object.fromEntries(formData)
    console.log(formProps)
    for(let [key, value] of Object.entries(formProps)) {
        if(!value) {
            message.innerText = "Error: All text inputs are requried"
        }
    }
    getAllTodos()
    postNewTodo(formProps)
})

const putEditTodo = async (id, data) => {
    try {
        console.log(data)
        const newTodo = {id:parseInt(id), ...data}
        console.log(newTodo)
        const response = await fetch('http://localhost:3500/todos/todos', {
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(newTodo)
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

for(let btn of editButtons) {
    btn.addEventListener('click', e => {
        e.preventDefault()
        const parentRow = e.target.parentNode.parentNode
        console.log(parentRow)
        const id = parentRow.id
        console.log(todos)
        //not use triple equal todo.id === id
        const curTodo = todos.filter(todo => todo.id == id)[0]
        console.log(curTodo)
        parentRow.innerHTML = `
            <td>${id} </td>
            <td> 
                <input type="text" name="title" id="title" value="${curTodo.title}" required />
            </td>
            <td> 
                <input type="text" name="description" id="description" value="${curTodo.description}" required />
            </td>
            <td>
                <div class="select" >
                    <select name="status" id="status" >
                        <option value="in_progress" ${curTodo.status === "in_progress" && "selected"} >
                            In progress
                        </option>
                        <option value="completed" ${curTodo.status === "completed" && "selected"} >
                            Completed
                        </option>
                    </select>
                </div>
            </td>
            <td>
                <div class="select" >
                    <select name="priority" id="priority" >
                        <option value="low" ${curTodo.priority === "low" && "selected"} >
                            Low
                        </option>
                        <option value="medium" ${curTodo.priority === "medium" && "selected"} >
                            Medium
                        </option>
                        <option value="high" ${curTodo.priority === "high" && "selected"} >
                            High
                        </option>
                    </select>
                </div>
            </td>
               <td>${curTodo.timestamp}</td>
            <td>
                <button type="submit" class="editButton button">Save</button>
                <button class="deleteButton button">Delete</button>
                <button class="finishedButton button">Finished</button>
            </td>
        `
        const editTodoForm = document.getElementById("editTodoForm")
        editTodoForm.addEventListener("submit", e => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const formProps = Object.fromEntries(formData)
            for(let [key, value] of Object.entries(formProps)){
                if(!value) {
                    message.innerText = "Error: All text inputs are required"
                }
            }
            putEditTodo(id, formProps)
        })
    })
}

const deleteTodo = async (id) => {
    try {
        const response = await fetch('http://localhost:3500/todos/todos', {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({id:id})
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

//not event delegation
for(let btn of deleteButtons) {
    btn.addEventListener('click', e => {
        e.preventDefault()
        console.log(e.target)
        console.log(e.target.parentNode.parentNode.id)
        const id = e.target.parentNode.parentNode.id
        deleteTodo(id)
    })
}