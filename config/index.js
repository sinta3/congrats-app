const { PORT, SESSION_SECRET, CRON_TIME, timezone } = require('./environment')
const db = require('./database')

module.exports = {
    PORT,
    db,
    SESSION_SECRET,
    CRON_TIME,
    timezone
}
