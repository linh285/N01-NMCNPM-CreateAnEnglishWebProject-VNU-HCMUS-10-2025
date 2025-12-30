const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối (Giống mongoose.connect)
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres', // mình đang dùng PostgreSQL
        logging: false,      // Tắt log query rác cho đỡ rối mắt
    }
);

// Hàm kiểm tra kết nối xem sống hay chết
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối PostgreSQL thành công!');
    } catch (error) {
        console.error('Kết nối thất bại:', error);
    }
};

module.exports = { sequelize, connectDB };