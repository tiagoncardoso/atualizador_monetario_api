// Create express app
const express = require("express")
const cors = require('cors')
const app = express()
const db = require('./database')

app.use(cors())

// Server port
const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server is now running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"status": "Server is UP"})
})

app.get('/api/:ano/ipca/', (req, res, next) => {
    const query = 'SELECT indices FROM ipca WHERE ano = ?'
    let params = [req.params.ano]

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result = JSON.parse(row.indices)
        })

        res.json({
            message: 'success',
            data: result
        })
    })
})

app.get('/api/:ano/inpc/', (req, res, next) => {
    const query = 'SELECT indices FROM inpc WHERE ano = ?'
    let params = [req.params.ano]

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result = JSON.parse(row.indices)
        })

        res.json({
            message: 'success',
            data: result
        })
    })
})


// Default reponse for any other request
app.use((req, res) => {
    res.status(404)
})