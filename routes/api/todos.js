const express = require('express')
const router = express.Router()

const todosController = require('../../controllers/todosController')




router.route('/:filename')
    .get(todosController.getAllTodos)
    .post(todosController.createNewTodo)
    .put(todosController.updateTodo)
    .delete(todosController.deleteTodo)

router.route('/:filename/:id')
    .get(todosController.getTodo)

module.exports = router;