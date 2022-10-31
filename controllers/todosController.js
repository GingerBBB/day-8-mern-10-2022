const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

/* 
* only get request create new file
*/

const getAllTodos = async (req,res) => {
    const filename = req.params.filename + '.json'
    try {
        const apiPath = path.join(__dirname, '..', 'model', filename)
        const data = await fsPromises.readFile(apiPath, 'utf-8')
        const todos = JSON.parse(data)
        res.json(todos)
    } catch (error) {
        if(error.code === 'ENOENT'){
            res.status(404).json({
                error: "ENOENT: no such file or directory",
                description: `The file ${filename} does not exist`
            })
        } else {
                    //console.log(error)
            res.status(400).json({error:error.message})
        }
    }
}

const createNewTodo = async (req, res) => {
    /* 
    TODO 1, check if todos.json exist 
    TODO 2, if exist, read from todos.json
    TODO 3, if not exist, catch error
    TODO 4, update todos
    TODO 5, write to todos.json after updating
     */

    const filename = req.params.filename + '.json'

    let newTodo = {
        // id: data.todos === '' ? 1 : data.todos[data.todos.length-1].id+1,
        title:req.body.title,
        description:req.body.description,
        status:req.body.status,
        priority:req.body.priority,
        timestamp: new Date()
    }
    if(!newTodo.title || !newTodo.description || !newTodo.status || !newTodo.priority){
        return res.status(400).json({'message': 'all fields are required'})
    }
    const apiPath = path.join(__dirname, '..', 'model', filename)
    console.log('apiPath ', apiPath)
    //! ? IS THAT TRY CATCH BLOCK ALWAY REQUIRED IN PROMISE
    try {
        if(!fs.existsSync(apiPath)){
            newTodo = {id: 1, ...newTodo}
            const initialData = [newTodo]
            await fsPromises.writeFile(apiPath, JSON.stringify(initialData))
            res.status(201).json(initialData)
        } else {
            
            //read previous todos from the todo.json
            const prevData = await fsPromises.readFile(apiPath, 'utf-8')
            // console.log(prevData)
            const prevTodos = JSON.parse(prevData)
            newTodo = {id:prevTodos.length + 1, ...newTodo}
            //add new todo item to prevs tods
            //? make a new copy or just push, which is better
            const newTodos = [...prevTodos, newTodo]
            //overwrite newTodos in todo.json
            // ? not append because array
            await fsPromises.writeFile(apiPath, JSON.stringify(newTodos))
            // ? why write res here, automatically return?
            res.status(201).json(newTodos)
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
    
}

const updateTodo = async (req, res)=> {
    console.log('req.body', req.body)
    const filename = req.params.filename + '.json'
    try {
        const apiPath = path.join(__dirname, '..', 'model', filename)
        const data = await fsPromises.readFile(apiPath, 'utf-8')
        const todos = JSON.parse(data)
        const curTodo = todos.find(todo=>todo.id === parseInt(req.body.id))
        if(!curTodo){
            return res.status(400).json({'message': 'Todo is not found'})
        }
        console.log('req.body', req.body)
        if(req.body.title) curTodo.title = req.body.title
        if(req.body.description) curTodo.description = req.body.description
        if(req.body.status) curTodo.status = req.body.status
        if(req.body.priority) curTodo.priority = req.body.priority
        
        const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.body.id))
        const ursortedTodos = [...filteredTodos, curTodo]
        const newTodos = ursortedTodos.sort((a,b)=>a.id-b.id)
        await fsPromises.writeFile(apiPath, JSON.stringify(newTodos))
        res.json(newTodos)
    } catch (error) {
        console.log(error)
        if(error.code === 'ENOENT'){
            res.status(404).json({
                error: "ENOENT: no such file or directory",
                description: `The file ${filename} does not exist`
            })
        } else {
                    //console.log(error)
            res.status(400).json({error:error.message})
        }
    }
}


const deleteTodo = async (req,res)=> {
    const filename = req.params.filename + '.json'
    try {
        const apiPath = path.join(__dirname, '..', 'model',filename)
        const data = await fsPromises.readFile(apiPath, 'utf-8')
        const todos = JSON.parse(data)
        const curTodo = todos.find(todo => todo.id === parseInt(req.body.id))
        if(!curTodo) {
            return res.status(400).json({"message": 'todo is not found'})
        }
        const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.body.id))
        if(filteredTodos.length === 0) {
            await fsPromises.unlink(apiPath)
            res.json('The json file is deleted')
        } else {
            await fsPromises.writeFile(apiPath, JSON.stringify(filteredTodos))
            res.json({filteredTodos})
        }
        
    } catch (error) {
        console.log(error)
        if(error.code === 'ENOENT'){
            res.status(404).json({
                error: "ENOENT: no such file or directory",
                description: `The file ${filename} does not exist`
            })
        } else {
            
            res.status(400).json({error:error.message})
        }
    }
}

const getTodo = (req, res) => {
    res.json({"id":req.params.id})
}

module.exports = {
    getAllTodos,
    createNewTodo,
    updateTodo,
    deleteTodo,
    getTodo
}

