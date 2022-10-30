const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

// built-in middleware for json 
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello World')
})

app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params)
  })

app.use('/todos', require('./routes/api/todos'))



app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))