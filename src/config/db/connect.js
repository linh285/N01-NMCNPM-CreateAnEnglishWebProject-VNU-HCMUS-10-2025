const Sequelize = require('sequelize');

// 1. Tạo kết nối (Hardcode user/pass ở đây)
const sequelize = new Sequelize('EnglishWeb', 'postgres', '016926', {
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false // Tắt log cho đỡ rối mắt
});

// 2. Hàm test kết nối (để main.js gọi cho vui)
const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối PostgreSQL thành công!');
    } catch (error) {
        console.error('Kết nối thất bại:', error);
    }
};

// 3. Xuất cả 2 ra ngoài:
// - sequelize: để bên Models dùng
// - connect: để bên Main dùng
module.exports = { sequelize, connect };

