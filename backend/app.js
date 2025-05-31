const express = require('express')
const app = express()
const port = 5000
const path = require('path')

const cors = require('cors')
app.use(cors())
app.use(express.json())
//app.use(express.static(path.join(__dirname,'../frontend/build')))

const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.Mongo_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error:', err));

const Todo = require('./model');
app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/getlists', async (req, res) => {
  try {
    const lists = await Todo.find({}, 'listname');
    res.status(200).json([...new Set(lists.map(item => item.listname))]);
    //res.status(200).json(['first list','second list','third list']);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.get('/gettasks', async (req, res) => {
  const { listname, completed } = req.query;
  try {
    const result = await Todo.find({ listname:listname,completed:completed });
    //if (!result) return res.status(404).json([]);

    //const filteredTasks = result.taskname.filter(task => task.completed.toString() === completed);
    //console.log(filteredTasks)
    res.status(200).json(result.map(t=>t.task));
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})


app.post('/addlist', async (req, res) => {
  try {
    const { listname } = req.body;

    const newList = new Todo({
      listname
    });

    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.post('/addtask', async (req, res) => {
  try {
    const { listname, task} = req.body;

    const newTask = new Todo({
      listname,
      task,
      completed:false
    });

      await newTask.save();    
    res.status(201).json(newTask.task);
    //console.log(result.taskname.task)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.post('/completed', async (req, res) => {
  try {
    const { listname, taskname } = req.body;

    await Todo.updateOne({ listname: listname, task: taskname },
      { $set: { completed: true } }
    );
    console.log(taskname)
    res.status(201).json(taskname);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.post('/completedremove', async (req, res) => {
  try {
    const { listname, taskname } = req.body;

    await Todo.updateOne({ listname: listname, task: taskname },
      { $set: {completed: false } }
    );
    console.log(taskname)
    res.status(201).json(taskname);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.post('/delete', async (req, res) => {
  try {
    const { listname, taskname } = req.body;

    await Todo.deleteOne({ listname: listname , task: taskname});
    res.status(201).json({message:"task deleted"});
  } catch (err) {
    res.status(500).json({error:err.message});
  }

})

app.post('/removelist', async (req, res) => {
  try {
    const { listname} = req.body;

    await Todo.deleteMany({ listname: listname});
    res.status(201).json({message:"task deleted"});
  } catch (err) {
    res.status(500).json({error:err.message});
  }

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})