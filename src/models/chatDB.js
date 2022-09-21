const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatSchema = new Schema({
    
    nombre: String,
    correo: String,
    status: String,
    socketIn: String,
    pssIngreso: String,
    canalPago: String,
    created_at: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Chat', ChatSchema);