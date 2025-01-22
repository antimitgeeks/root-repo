// Import Required Packages
const express = require("express");

// Import Controllers

// Initialize Router
const router = express.Router();
const Partners = require('../models/partners.model.js');
const Languages = require('../models/languages.model.js');
const AppSettings = require('../models/appSettings.model.js');
const SetupGuides = require('../models/setupGuides.model.js');
const { shopify } = require("../../shopify.js");
const PLAN = {
    FREE_AMOUNT: 0,
    FREE_NAME: 'essential',
    BASIC: 'basic',
    ENTERPRISE: 'enterprise',
    PROFESSIONAL: 'professional',
}


/**
 * Route: GET /shopDetails
 * Description: Fetch details of the shop
 * Controller: authControllers.getShopDetails
 */
// router.post("/products/count", (req, res) => {

//     console.log('--------------------------------server response1');
//     res.status(200).send({ count: 43 });
// });
router.post("/api/partner/update",async (req, res) => {

    console.log('--------------------------------api/partner/update');
    await Partners.updateOne({ _id: req.currentPartnerInfo?._id }, req.body);
     
    res.status(200).send({
        status: true,
        message: "updated"
    });
});
router.post("/api/language/list",async (req, res) => {

    console.log('/api/language/list');
    const params=req.body

    const details = await Languages.find().sort({ createdAt: -1 }).limit(params.limit).skip(params.offset);
    

    // Return the response structure with success message and fetched data
    const data = {
        status: true,
        message: `Language fetched`,  // Success message indicating the list was fetched
        data: details  // The list of languages fetched from the database
    };

    res.status(200).send(data);
});
router.post("/api/partner/info", async(req, res) => {

    console.log('/api/partner/info ');
     
    // res.status(200).send({ count: "/api/partner/info" });
    const details = await Partners.findOne({ _id: req.currentPartnerInfo?._id}).populate('languageId');
    data= {
        status: true,
        message: `Partner info fetched`,
        data: details
    }
    res.status(200).send(data);
});

// Export the Router
router.post("/api/partner/create",async  (req, res) => {

    console.log('api hit create partner info');
    const session = res.locals.shopify.session || res.locals.shopify;
     // Fetch shop information using the Shopify REST API
     const shopInfo = await shopify.api.rest.Shop.all({
        session: session,
    });
    if (!shopInfo.data?.length) {
        data= {
            status: false,
            message: `Partner ${ErrorMessage.NOT_CREATED}`
        };
        res.status(200).send(data);
    }
    const storData = shopInfo.data[0];
    // Check if a store already exists in the database based on its myshopify_domain
    const storeExist = await Partners.findOne({ myshopify_domain: storData.myshopify_domain }).select("-password");
    if (storeExist) {
        data= {
            status: true,
            message: `Partner created`,
            data: storeExist
        };
        res.status(200).send(data);
    }
    // find default language id 
    const languageDetails = await Languages.findOne({ default: true }).select('_id');
    // paper partner details
    const details = {
        shopJson: storData,
        myshopify_domain: storData.myshopify_domain,
        amount: PLAN.FREE_AMOUNT,
        planName: PLAN.FREE_NAME,
        languageId: languageDetails?._id
    };

    const partnerDetails = await Partners.create(details);

    // added default app settings
    await this.addedDefaultAppSettings(partnerDetails._id);
    // added default setup guid
    await this.addedDefaultSetupGuid(partnerDetails._id);

    // return {
    //     status: true,
    //     message: `Partner ${SuccessMessage.CREATED}`,
    //     data: partnerDetails
    // };
if(!storeExist){
    res.status(200).send({
        status: true,
        message: `Partner Created`,
        data: partnerDetails
    });
}




   


});


exports.createPartner = async (session) => {
    // Fetch shop information using the Shopify REST API
    const shopInfo = await shopify.api.rest.Shop.all({
        session: session,
    });
    if (!shopInfo.data?.length) {
        return {
            status: false,
            message: `Partner ${ErrorMessage.NOT_CREATED}`
        };
    }
    const storData = shopInfo.data[0];
    // Check if a store already exists in the database based on its myshopify_domain
    const storeExist = await Partners.findOne({ myshopify_domain: storData.myshopify_domain }).select("-password");
    if (storeExist) {
        return {
            status: true,
            message: `Partner Created`,
            data: storeExist
        };
    }
    // find default language id 
    const languageDetails = await Languages.findOne({ default: true }).select('_id');
    // paper partner details
    const details = {
        shopJson: storData,
        myshopify_domain: storData.myshopify_domain,
        amount: PLAN.FREE_AMOUNT,
        planName: PLAN.FREE_NAME,
        languageId: languageDetails?._id
    };

    const partnerDetails = await Partners.create(details);

    // added default app settings
    await this.addedDefaultAppSettings(partnerDetails._id);
    // added default setup guid
    await this.addedDefaultSetupGuid(partnerDetails._id);

    return {
        status: true,
        message: `Partner created`,
        data: partnerDetails
    };
}

// current partner default app settings update
exports.addedDefaultAppSettings = async (partnerId) => {
    const details = {
        partnerId: partnerId,
        contactInformation: {
            "isOn": false,
            "email": {
                "isOn": false,
                "time": null
            },
            "phone": {
                "isOn": false,
                "time": null
            }
        },
        shippingDetails: {
            "isOn": false
        },
        orderItems: {
            "isOn": true,
            "quantity": {
                "isOn": false,
                "time": null
            },
            "swap": {
                "isOn": false,
                "time": null
            },
            "removeItem": {
                "isOn": false,
                "time": null
            },
            "addItems": {
                "isOn": true,
                "time": null
            }
        },
        orderManage: {
            "updateAddress": 1,
            "contactInformation": 2,
            "orderItems": 3,
            "orderActions": 4,
            "contactSupport": 5,
            "cancelOrder": 6
        },
        presetTimeFrame: {
            "time": "60minutes",
            "type": ""
        },
        cancelOrder: {
            "isOn": false,
            "refunds": {
                "storecredit": false,
                "directrefund": false
            },
            "reason": [
                {
                    "title": "Cancel reason 1",
                    "desc": "Found a better price",
                    "default": true
                },
                {
                    "title": "Cancel reason 2",
                    "desc": "Change my mind",
                    "default": true
                },
                {
                    "title": "Cancel reason 3",
                    "desc": "Item no longer need",
                    "default": true
                },
                {
                    "title": "Cancel reason 4",
                    "desc": "Shipping cost too high",
                    "default": true
                },
                {
                    "title": "Cancel reason 5",
                    "desc": "Item details changed (e.g., description,price)",
                    "default": true
                }
            ],
            "restockingFees": {
                "isOn": false,
                "type": "",
                "fee": 0,
                "message": ""
            }
        },
        support: {
            "isOn": false
        }
    }
    await AppSettings.create(details);
    return true
}

// current partner default setup guid
exports.addedDefaultSetupGuid = async (partnerId) => {
    const details = {
        partnerId: partnerId,
        orderEditingFeature: false,
        editingWindow: false,
        smartCollections: false,
        plan: false
    }
    await SetupGuides.create(details);
    return true
}

// Export the Router
module.exports = router;
