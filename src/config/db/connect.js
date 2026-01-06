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

// 1. Tạo kết nối (Dùng thông số Public Network từ Railway)
const sequelize = new Sequelize('railway', 'postgres', 'KkhhWnLOXNCuboBpimIOGxVBRcPnRGfq', {
    host: 'centerbeam.proxy.rlwy.net', // Lấy từ ảnh image_5d52e7.png
    port: 49824,                       // Lấy từ ảnh image_5d52e7.png
    dialect: 'postgres',
    logging: false, 
    dialectOptions: {
        ssl: {
            require: true,               // Railway bắt buộc dùng SSL để kết nối từ bên ngoài
            rejectUnauthorized: false    // Tránh lỗi chứng chỉ bảo mật khi chạy local
        }
    }
});

// 2. Hàm test kết nối
const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối Database Railway thành công!');
        
        // 👇 Dòng này sẽ tự động vẽ lại bảng theo code mới của bạn
        // Chỉ để force: true LẦN ĐẦU NÀY THÔI, sau đó phải sửa thành false
        await sequelize.sync({ force: true }); 
        console.log('Đã cập nhật cấu hình bảng mới nhất lên Railway!');
        
    } catch (error) {
        console.error('Kết nối Railway thất bại:', error);
    }
};

module.exports = { sequelize, connect };