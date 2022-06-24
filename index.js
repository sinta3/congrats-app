const express = require('express')
const app = express()
const session = require('express-session')
const router = require('./routes/index')
const { PORT, db, SESSION_SECRET } = require('./config')
const { send_to_user } = require('./cron')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET
    })
)
app.use('/congrats', router)

if (db) {
    app.listen(PORT, () => {
        console.log(`this app listen on PORT: ${PORT}`)
        send_to_user()
    })
}
