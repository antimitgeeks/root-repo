// Import Required Packages
const express = require("express");

// Import Controllers

// Initialize Router
const router = express.Router();

/**
 * Route: GET /shopDetails
 * Description: Fetch details of the shop
 * Controller: authControllers.getShopDetails
 */
router.get("/products/count", (req, res) => {
    console.log('--------------------------------server response1');
    res.status(200).send({ count: 43 });
});
// Export the Router
module.exports = router;
