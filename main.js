const express = require('express');

var morgan = require('morgan');
const path = require('path');

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;



// 1. Cho phép mọi nơi gọi vào (Hoặc chỉ định rõ localhost:3000)
const cors = require('cors');
app.use(cors());

// 2. BẬT MORGAN để theo dõi mọi request (Xóa comment dòng này)
app.use(morgan('dev')); 

// 3. Cấu hình Static files
app.use(express.static(path.join(__dirname, 'public')));

// 4. tạo kết nối db
const db = require('./src/config/connect');
db.connect();

// 7. tạo patched
// routes init
route(app);

// 8. xử lí lỗi
const solvingError = require('./app/middlewares/solvingError');
solvingError(app);

// start server

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});