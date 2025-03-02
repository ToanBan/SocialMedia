const {Schema, mongo, default: mongoose} = require('mongoose')
const MessagesSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});


const Message = mongoose.models.Message || mongoose.model('Message', MessagesSchema);
module.exports = Message