// Đường dẫn: src/config/connect.js

const db = require('../models'); 

async function connect() {
    try {
        // Hàm authenticate() là hàm chuẩn để test kết nối
        await db.sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

module.exports = { connect };