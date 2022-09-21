const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({

    ciudad: String,
    username: String,
    message: String,
    codeIngreso: String,
    created_at: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('dbUsuariosChat', userSchema);