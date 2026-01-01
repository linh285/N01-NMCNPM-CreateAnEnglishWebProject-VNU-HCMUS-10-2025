const {Account} = require('../models');
const HttpError = require('http-errors');
const {signAuth, isAuth} = require('../middlewares/authMiddleware');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Bước 1: Tìm user theo email
        const user = await Account.findOne(
            { 
                where: { 
                    email
                } 
            }
        );
        // Bước 2: Kiểm tra email + password
        // (Lưu ý: Tạm thời so sánh trực tiếp, sau này CẦN dùng bcrypt để so sánh hash)
        if (!user || user.password !== password) {
            throw HttpError(401, 'Invalid email or password');
        }
        // Bước 3: Đăng nhập thành công -> ký giấy thông hành (Token)
        const token = signAuth(user);
        res.status(200).json(
            { 
                message: 'Login successful', 
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }, 
                token 
            }
        );
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Bước 1: Kiểm tra email đã tồn tại chưa
        const existingUser = await Account.findOne(
            { 
                where: { 
                    email 
                } 
            }
        );
        if (existingUser) {
            throw HttpError(409, 'Email already exists');
        }
        // Bước 2: Tạo user mới với role mặc định là LEARNER
        const newUser = await Account.create(
            { 
                email, 
                password,
                role: 'LEARNER'
            }
        );
        // Bước 3: Đăng ký xong thì cho đăng nhập luôn (Tạo token luôn)
        const token = signAuth(newUser);
        
        res.status(201).json(
            { 
                message: 'Registration successful', 
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                }, 
                token
            }
        );
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    try {
        // Logout với JWT thực chất chỉ cần phía Client xóa token đi là xong.
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

exports.getMe = (req, res, next) => {
    // Nhờ middleware isAuth ở trên, ta đã có req.user
    res.status(200).json({ 
        message: 'Đây là thông tin của bạn', 
        profile: req.user 
    });
};
