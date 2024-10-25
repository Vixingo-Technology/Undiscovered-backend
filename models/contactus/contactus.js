const mongoose = require('mongoose')

const contactUsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Unanswered'
    },
    is_verified: {
        type: Boolean,
        default: false
    }
})
const contactusmodel = mongoose.model('contactus', contactUsSchema)

module.exports = contactusmodel