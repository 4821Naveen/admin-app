
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/shop';

async function checkDb() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const ordersCount = await Order.countDocuments();
        console.log('Total Orders:', ordersCount);

        if (ordersCount > 0) {
            const orders = await Order.find({}).limit(1).lean();
            console.log('Sample Order:', JSON.stringify(orders[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDb();
