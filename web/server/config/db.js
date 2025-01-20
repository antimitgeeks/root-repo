const mongoose = require("mongoose");

// Function to establish a connection to the MongoDB database
exports.dbConnection = async () => {
    try {
        // Using mongoose.connect to establish a connection to the MongoDB database
        const connectionString = process.env.NODE_ENV !== 'production' ? `${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin` : process.env.DB_URL;
        console.log(connectionString, '::: --- DataBase connection string ---');

        // Connect to the MongoDB database
        await mongoose.connect(connectionString);

        // Log a success message once the connection is successful
        console.log(`--- Connected to MongoDB (${process.env.NODE_ENV}) Successfully ---`);
    } catch (error) {
        console.error(error, `--- MongoDB Connection Failed (${process.env.NODE_ENV}) ---`);
    }
};
