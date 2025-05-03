const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

app.get('/movie', (req, res) => {
    connection.query(
        'SELECT * FROM movie',
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.get('/movie/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM movie WHERE id = ?', [id],
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.post('/movie', (req, res) => {
    connection.query(
        'INSERT INTO `movie` (`Mname`, `Diary`, `Details`, `Date`, `Cover`) VALUES (?, ?, ?, ?, ?)',
        [req.body.Mname, req.body.Diary, req.body.Details, req.body.Date, req.body.Cover],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /movie:', err);
                res.status(500).send('Error adding movie');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

app.put('/movie', (req, res) => {
    connection.query(
        'UPDATE `movie` SET `Mname`=?, `Diary`=?, `Details`=?, `Date`=?, `Cover`=? WHERE id =?',
        [req.body.Mname, req.body.Diary, req.body.Details, req.body.Date, req.body.Cover, req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.delete('/movie', (req, res) => {
    connection.query(
        'DELETE FROM `movie` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// export the app for vercel serverless functions
module.exports = app;
