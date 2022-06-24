const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
    type_data: { type: String },
    start_sentence: { type: String },
    end_sentence: { type: String },
    hour: { type: String }
})

const ConfigText = mongoose.model('ConfigText', configSchema)
module.exports = ConfigText
