require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    SESSION_SECRET: process.env.SECRET,
    CRON_TIME: process.env.CRON_TIME,
    timezone: process.env.timezone
}
