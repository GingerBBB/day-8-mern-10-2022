const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const data = {
    todos:require('../../data/todos.json'),
    setTodos: function(data) {this.todos = data}
}
router.route('/')
    .get((req,res) => {
        res.json(data.todos)
    })
    .post((req, res) => {
        // console.log(req)
        if(!data.todos){
            const initial = []
            fs.writeFile(path.join(__dirname, '../../data', 'todos.json'), initial)
        }
        // console.log(path.join(__dirname, '../../data', 'todos.json'))
        const newTodo = {
            id:data.todos[data.todos.length-1].id+1 || 1,
            title:req.body.title,
            description:req.body.description,
            status:req.body.status,
            priority:req.body.priority,
            timestamp: new Date()
        }

        if(!newTodo.title || !newTodo.description || !newTodo.status || !newTodo.priority){
            return res.status(400).json({'message': 'all fields are required'})
        }

        data.setTodos([...data.todos, newTodo])
        res.status(201).json(data.todos)
    })
    .put((req, res)=> {
        const curTodo = data.todos.find(todo=>todo.id === parseInt(req.body.id))
        if(!curTodo){
            return res.status(400).json({'message': 'Todo is not found'})
        }
        if(req.body.title) curTodo.title = req.body.title
        if(req.body.description) curTodo.description = req.body.description
        if(req.body.status) curTodo.status = req.body.status
        if(req.body.priority) curTodo.priority = req.body.priority
        
        const filteredTodos = data.todos.filter(todo => todo.id !== parseInt(req.body.id))
        const ursortedTodos = [...filteredTodos, curTodo]
        data.setTodos(ursortedTodos.sort((a,b)=>a.id-b.id))
        res.json(data.todos)
    })
    .delete((req,res)=> {
        res.json({"id":req.body.id})
    })

router.route('/:id')
    .get((req, res) => {
        res.json({"id":req.params.id})
    })

module.exports = router;