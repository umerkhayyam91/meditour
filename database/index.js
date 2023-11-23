const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log(`Database connected to host: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

module.exports = dbConnect;