const CronJob = require('cron').CronJob
const { sendToUser } = require('./controller/userController')

module.exports = {
    send_to_user: () => {
        const job = new CronJob(process.env.CRON_TIME, async () => {
            await sendToUser()
        })
        job.start()
        console.log('==================================================')
        console.log('Cron jb initialized (see .env.* for detail)')
        console.log('1. ' + 'send_to_user' + ' run at' + ` ${process.env.CRON_TIME}`)
        console.log('-----')
    }
}
