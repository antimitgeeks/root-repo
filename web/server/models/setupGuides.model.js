const mongoose = require("mongoose");

const setupGuidesSchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
    },
    orderEditingFeature: {
        type: Boolean,
        default: false
    },
    upSellFeature: {
        type: Boolean,
        default: false
    },
    editingWindow: {
        type: Boolean,
        default: false
    },
    smartCollections: {
        type: Boolean,
        default: false
    },
    plan: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
    },
    pricingBanner: {
        type: Boolean,
        default: true
    }
},
    { 'timestamps': true }

);

const SetupGuides = mongoose.model("setupGuides", setupGuidesSchema);

module.exports = SetupGuides;
