const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const jwtSecret = 'testcKZawBMAollpOC=wM88fwe8sVpF6105qmaGk3oekzVFllklvQ8D-Vh/nxhLOt4A3pQ13ZClwDCw/xHUkMsMc6Cwhln/2c3QCioNvNVqAOpoSrVRY8lp76QANxlkGyW-We7SeGsnaCLqx6yd9wTgQGtiS9Cf9ZyP5l!4!Npf!5CutU3tfLYAXDIyeUcUMIy1GYlDIrU76!X4Y3SzLxu!fE40jt4I=HOHF1niYZ9UslZ-OPyN/W2S7rwD9FSyl';
const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const pool = mysql.createPool({
  socketPath: '/var/lib/mysql/mysql.sock',
  charset: 'utf8mb4',
  user: 'dbuser',
  password: 'dbpass',
  database: 'dbname'
});

const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
  }
};

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Ошибка при подключении к базе данных: ", err);
    return;
  }
  console.log('Connected to the MySQL server.');
  connection.release();
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    pool.query(sql, [username, email, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.status(201).send({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  pool.query(sql, [username], async (error, results) => {
    try {
      if (error) {
        console.error("Ошибка при выполнении SQL-запроса:", error);
        throw error;
      }
      if (results.length === 0) {
        return res.status(401).send({ message: 'Invalid username or password' });
      }
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ message: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });
      res.send({ message: 'User logged in successfully', token });
    } catch (error) {
      console.error("Ошибка при обработке логина:", error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
});


app.get('/tasks', jwtMiddleware, (req, res) => {
  const sql = 'SELECT id, title, description, due_date as dueDate, completed, priority FROM tasks';
  pool.query(sql, (error, results) => {
      if (error) {
          return res.status(500).send(error);
      }
      console.log('Отправленные задачи:', results);
      res.json(results);
  });
});

app.post('/tasks', jwtMiddleware, (req, res) => {
  const { title, description, dueDate, priority, completed = false } = req.body;
  const sql = 'INSERT INTO tasks (title, description, due_date, priority, completed) VALUES (?, ?, ?, ?, ?)';
  pool.query(sql, [title, description, dueDate, priority, completed], (error, results) => {
    if (error) {
      console.error('Ошибка при добавлении задачи:', error);
      return res.status(500).send({ message: 'Ошибка при добавлении задачи', error: error.toString() });
    }
    res.json({ id: results.insertId, title, description, dueDate, priority, completed });
  });
});

app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  pool.query(sql, [id], (error, results) => {
      if (error) {
          return res.status(500).send(error);
      }
      if (results.length === 0) {
          return res.status(404).send({ message: 'Task not found' });
      }
      res.json(results[0]);
  });
})

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, completed } = req.body;
  const sql = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, completed = ? WHERE id = ?';
  pool.query(sql, [title, description, dueDate, priority, completed, id], (error, results) => {
    if (error) {
      console.error('Ошибка при обновлении задачи:', error);
      return res.status(500).send(error);
    }
    res.json({ id, title, description, priority, dueDate });
  });
});

app.patch('/tasks/:id/completed', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  console.log(`Запрос на обновление статуса задачи ${id}: ${completed}`);
  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  pool.query(sql, [completed, id], (error, results) => {
      if (error) {
          console.error('Ошибка при обновлении статуса задачи:', error);
          return res.status(500).send(error);
      }
      res.json({ message: 'Статус задачи обновлен' });
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});