const express = require('express');
var morgan = require('morgan');
const path = require('path');

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;



// Cho phép mọi nơi gọi vào (Hoặc chỉ định rõ localhost:3000)
const cors = require('cors');
app.use(cors());

const db = require('./config/db');
// 1. Kết nối Database
db.connect();

// 2. BẬT MORGAN để theo dõi mọi request (Xóa comment dòng này)
app.use(morgan('dev')); 

// 3. Cấu hình Static files
app.use(express.static(path.join(__dirname, 'public')));

// routes init
route(app);

// BƯỚC A: Bắt lỗi 404 cho URL sai (Route Not Found)
// Nếu request chạy qua hết route(app) mà chưa ai trả lời, nó sẽ rơi xuống đây.
app.use((req, res, next) => {
    // Tạo ra một lỗi 404 và ném xuống cho thằng Error Handler bên dưới xử lý
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Chuyền bóng sang Bước B
});

// BƯỚC B: Bộ xử lý lỗi trung tâm (Error Handler Middleware)
// Hứng tất cả: Lỗi 404 từ Bước A + Lỗi throw/next(err) từ Controller
app.use((err, req, res, next) => {
    // 1. Lấy status code: Nếu err có status (ví dụ 404) thì lấy, không thì mặc định 500
    const statusCode = err.status || 500;

    // 2. Xử lý hiển thị
    if (statusCode === 404) {
        // Render trang 404.hbs
        return res.status(404)
    }

    // 3. Xử lý lỗi 500 (Lỗi hệ thống)
    console.error("ERROR STACK:", err.stack); // Ghi log cho Dev xem
    
    // Render trang error.hbs (Trang 500)
    res.status(500)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});