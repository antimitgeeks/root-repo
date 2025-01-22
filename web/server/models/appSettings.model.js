const mongoose = require("mongoose");

const appSettingsSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
    },
    contactInformation: {
        type: JSON,
    },
    shippingDetails: {
        type: JSON,
    },
    orderItems: {
        type: JSON,
    },
    presetTimeFrame: {
        type: JSON,
    },
    orderManage: {
        type: JSON,
    },
    cancelOrder: {
        type: JSON,
    },
    support: {
        type: JSON,
    },
},
    { 'timestamps': true }

);

const AppSettings = mongoose.model("appSettings", appSettingsSchema);

module.exports = AppSettings;
