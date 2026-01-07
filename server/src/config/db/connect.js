// const Sequelize = require('sequelize');

// // 1. Tạo kết nối (Hardcode user/pass ở đây)
// const sequelize = new Sequelize('EnglishWeb', 'postgres', '016926', {
//     host: '127.0.0.1',
//     dialect: 'postgres',
//     logging: false // Tắt log cho đỡ rối mắt
// });

// // 2. Hàm test kết nối (để main.js gọi cho vui)
// const connect = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Kết nối PostgreSQL thành công!');
//     } catch (error) {
//         console.error('Kết nối thất bại:', error);
//     }
// };

// // 3. Xuất cả 2 ra ngoài:
// // - sequelize: để bên Models dùng
// // - connect: để bên Main dùng
// module.exports = { sequelize, connect };

const Sequelize = require('sequelize');
require('dotenv').config(); 

let sequelize;

// TRƯỜNG HỢP 1: Chạy trên Railway (Production)
// Railway tự động cung cấp biến DATABASE_URL chứa mọi thông tin cần thiết
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,             // Bắt buộc dùng SSL trên Cloud
                rejectUnauthorized: false  // Bỏ qua lỗi chứng chỉ (quan trọng để không bị lỗi kết nối)
            }
        }
    });
} 
// TRƯỜNG HỢP 2: Chạy ở máy nhà (Localhost)
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
        
        const host = sequelize.config.host || 'Railway URL';
        console.log(`🔌 Đang kết nối tới: ${host}`);

    } catch (error) {
        console.error('Kết nối thất bại:', error);
    }
};


module.exports = { sequelize, connect };