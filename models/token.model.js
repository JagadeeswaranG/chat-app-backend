const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const tokenSchema = mongoose.Schema({

// });

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
});

module.exports = mongoose.model("Tokens",tokenSchema);