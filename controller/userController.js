const moment = require('moment-timezone')
const axios = require('axios')
const User = require('../models/userModels')
const ConfigText = require('../models/configTextModel')

async function addUser(req, res) {
    try {
        let data = req.body
        const isNotValid = new User(data).validateSync()
        if (isNotValid) return res.status(400).json('input data tidak lengkap')

        //validate if exists
        const exists = await User.findOne({
            first_name: data.first_name,
            last_name: data.last_name,
            congrats_type: data.congrats_type,
            date: data.date
        })
        if (exists) return res.status(400).json('data sudah ada di database')
        const hour = await ConfigText.findOne({ type_data: data.congrats_type })
        const timezoneDefault = process.env.timezone
        data.time_send = moment(moment(`${data.date}T${hour.hour}:00`).tz(timezoneDefault))
            .tz(data.timezone)
            .format('YYYY-MM-DD HH:mm')
        await new User(data).save()
        res.status(200).json('success')
    } catch (error) {
        console.log(error)
        res.status(500).json('error server')
    }
}

async function deleteUser(req, res) {
    try {
        const id_user = req.params.id_user
        let userData = await User.findById(id_user)
        if (!userData) return res.status(400).json('data tidak ditemukan')

        await User.findByIdAndDelete(id_user)
        res.status(200).json('success')
    } catch (error) {
        console.log(error)
        res.status(500).json('error server')
    }
}

async function updateUser(req, res) {
    try {
        const id_user = req.params.id_user
        let userData = await User.findById(id_user)
        if (!userData) return res.status(400).json('data tidak ditemukan')

        let data = req.body
        const isNotValid = new User(data).validateSync()
        if (isNotValid) return res.status(400).json('input data tidak lengkap')

        //validate if exists
        const exists = await User.findOne({
            first_name: data.first_name,
            last_name: data.last_name,
            congrats_type: data.congrats_type,
            date: data.date
        })
        if (exists) return res.status(400).json('data sudah ada di database')
        const hour = await ConfigText.findOne({ type_data: data.congrats_type })
        const timezoneDefault = process.env.timezone
        data.time_send = moment(moment(`${data.date}T${hour.hour}:00`).tz(timezoneDefault))
            .tz(data.timezone)
            .format('YYYY-MM-DD HH:mm')

        await User.findByIdAndUpdate(id_user, data)
        res.status(200).json('success')
    } catch (error) {
        console.log(error)
        res.status(500).json('error server')
    }
}

async function resendAllMessage(req, res) {
    try {
        const date = req.params.date
        const userData = await User.find({
            isSent: false,
            date: date
        })
        let resultData = []
        for (let el of userData) {
            const https = require('https')
            const config = await ConfigText.findOne({ type_data: el.congrats_type })
            const data = JSON.stringify({
                text: `${config.start_sentence}${el.first_name} ${el.last_name} ${config.end_sentence}`
            })

            const options = {
                hostname: 'hookb.in',
                port: 443,
                path: '/2q0pkkLLKmhdLKbdGqoR',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            let result = await axios.post(
                'https://hookb.in/2q0pkkLLKmhdLKbdGqoR',
                {
                    'Content-Type': 'application/json'
                },
                data
            )

            if (result.status === 200) {
                el.isSent = true
                console.log(el)
                await el.save()
                resultData.push(el)
            }
            console.log(`status: ${res.status}`)
        }
        res.status(200).json({ resultData, msg: 'success' })
    } catch (error) {
        console.log(error)
    }
}

async function resendAllMessageEndDay(req, res) {
    try {
        const userData = await User.find({
            isSent: false,
            date: moment().format('YYYY-MM-DD')
        })
        let resultData = []
        for (let el of userData) {
            const https = require('https')
            const config = await ConfigText.findOne({ type_data: el.congrats_type })
            const data = JSON.stringify({
                text: `${config.start_sentence}${el.first_name} ${el.last_name} ${config.end_sentence}`
            })

            const options = {
                hostname: 'hookb.in',
                port: 443,
                path: '/2q0pkkLLKmhdLKbdGqoR',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }
            let result = await axios.post(
                'https://hookb.in/2q0pkkLLKmhdLKbdGqoR',
                {
                    'Content-Type': 'application/json'
                },
                data
            )

            if (result.status === 200) {
                el.isSent = true
                console.log(el)
                await el.save()
                resultData.push(el)
            }
            console.log(`status: ${res.status}`)
        }
    } catch (error) {
        console.log(error)
    }
}

async function sendToUser() {
    try {
        const userData = await User.find({ isSent: false, time_send: moment().format('YYYY-MM-DD HH:mm') })
        for (let el of userData) {
            const config = await ConfigText.findOne({ type_data: el.congrats_type })
            const data = JSON.stringify({
                text: `${config.start_sentence}${el.first_name} ${el.last_name} ${config.end_sentence}`
            })

            let result = await axios.post(
                'https://hookb.in/2q0pkkLLKmhdLKbdGqoR',
                {
                    'Content-Type': 'application/json'
                },
                data
            )

            if (result.status === 200) {
                el.isSent = true
                console.log(el)
                await el.save()
            }
            console.log(`status: ${result.status}`)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addUser,
    deleteUser,
    updateUser,
    sendToUser,
    resendAllMessage,
    resendAllMessageEndDay
}
