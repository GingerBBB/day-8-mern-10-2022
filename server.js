const express = require('express')
const fsPromises = require('fs').promises
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

// built-in middleware for json 
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "/public"))); // serve static files


app.set("views", path.join(__dirname, "/views")); // where template files are located
app.set('view engine', 'ejs')

app.get('/', async(req,res)=>{
    //
    const data = await fsPromises.readFile(path.join(__dirname,'model', 'todos.json'),
     'utf-8')
    // console.log(JSON.parse(data))
    res.render('index', {todos: JSON.parse(data)})
})

app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params)
  })

app.use('/todos', require('./routes/api/todos'))



app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))