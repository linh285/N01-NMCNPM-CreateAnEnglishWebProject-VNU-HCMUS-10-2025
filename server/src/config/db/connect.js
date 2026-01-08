const Sequelize = require('sequelize');
require('dotenv').config(); 

let sequelize;

// TRƯỜNG HỢP 1: Dùng biến môi trường chi tiết (khớp với file .env của bạn)
if (process.env.DB_HOST) {
    sequelize = new Sequelize(
        process.env.DB_NAME,     // Tên DB
        process.env.DB_USERNAME, // User
        process.env.DB_PASSWORD, // Pass
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false // Quan trọng để kết nối Railway
                }
            }
        }
    );
} 
// TRƯỜNG HỢP 2: Chạy trên Railway Production (nếu họ cung cấp DATABASE_URL gộp)
else if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} 
// TRƯỜNG HỢP 3: Chạy Localhost (Fallback cuối cùng)
else {
    sequelize = new Sequelize('EnglishWeb', 'postgres', '016926', {
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: false
    });
}

// 2. Hàm test kết nối
const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối PostgreSQL thành công!');
        
        // Log để kiểm tra xem đang kết nối đi đâu
        const config = sequelize.config;
        console.log(`🔌 Đang kết nối tới: ${config.host} trên cổng ${config.port || 5432}`);

    } catch (error) {
        console.error('Kết nối thất bại:', error);
    }
};

module.exports = { sequelize, connect };