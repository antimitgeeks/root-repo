const mongoose = require("mongoose");

const languagesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    key: {
        type: String
    },
    default: {
        type: Boolean
    }
},
    { 'timestamps': true }
);

const Languages = mongoose.model("languages", languagesSchema);

module.exports = Languages;
