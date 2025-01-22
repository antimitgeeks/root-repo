const { shopify } = require("../../shopify.js");
const Partners = require("../models/partners.model.js");
const partnerService = require("../routes/index.js");

exports.shopAuthenticate = async (request, response, next) => {
    try {

        // Extract the 'shop' parameter from the request query parameters.
        const { shop } = request.query;

        // Check if 'shop' parameter is not provided.
        if (!shop) {
            res.send(400).json({ message: "testing..........................." })
        }
        next();
    } catch (error) {
        console.log(error);
        res.send(400).json({ message: "testing..........................." })
    }
};

exports.authenticateUser = async (req, res, next) => {
    // check first api/ route session exist or not 
    const session = res.locals?.shopify?.session
    // Extract the 'shop' parameter from the request query parameters.
    let shop = req.query.shop || session?.shop;
    console.log("Current Shop : ", shop);

    let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);
    if (!shop) {
        console.log("shop not found");
        res.send(400).json({ message: "testing..........................." })
    }
    if (storeName?.length) {
        if (shop === storeName[0].shop) {
            res.locals.shopify = storeName[0];
            req.currentShop = storeName[0].shop;
            const details = await Partners.findOne({ myshopify_domain: req.currentShop });
            req.currentPartnerInfo = details

            next();
        } else {
            res.send(400).json({ message: "testing..........................." })
        }
    } else {
        res.send(400).json({ message: "testing..........................." })
    }

};