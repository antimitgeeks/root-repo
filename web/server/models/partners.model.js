const mongoose = require("mongoose");

const partnersSchema = new mongoose.Schema({
    shopJson: {
        type: JSON
    },
    myshopify_domain: {
        type: String
    },
    subscribeId: {
        type: String
    },
    interval: {
        type: String
    },
    languageId: {
        type: mongoose.Types.ObjectId,
        ref: "languages"
    },
    isTrail: {
        type: Boolean
    },
    chargeId: {
        type: Number
    },
    amount: {
        type: Number
    },
    planName: {
        type: String
    },
    isFreePlan: {
        type: Boolean
    },
},
    { 'timestamps': true }
);

const Partners = mongoose.model("partners", partnersSchema);

module.exports = Partners;
