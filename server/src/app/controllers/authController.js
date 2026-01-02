const { Account } = require('../models');
const HttpError = require('http-errors');
const { signAuth } = require('../middlewares/authMiddleware');
const bcrypt = require('bcryptjs'); // thư viện bảo mật

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validate 
        if (!email || !password) throw HttpError(400, 'Email and Password are required');

        const existingUser = await Account.findOne({ where: { email } });
        if (existingUser) throw HttpError(409, 'Email already exists');

        // MÃ HÓA MẬT KHẨU 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = await Account.create({ 
            email, 
            password: hashedPassword, // Lưu cái đã băm, KHÔNG lưu password gốc
            role: 'LEARNER'
        });

        const token = signAuth(newUser);
        
        res.status(201).json({ 
            message: 'Registration successful', 
            user: { id: newUser.id, email: newUser.email, role: newUser.role }, 
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findOne({ where: { email } });

        //  SO SÁNH MẬT KHẨU 
        // user.password trong DB là dạng hash ($2a$10$...)
        // password người dùng nhập là dạng thô (123456)
        // Dùng bcrypt.compare để so sánh
        if (!user) throw HttpError(401, 'Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw HttpError(401, 'Invalid email or password');

        const token = signAuth(user);
        res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user.id, email: user.email, role: user.role }, 
            token 
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        // req.user chỉ có {id, role} do middleware giải mã token
        // Ta phải dùng ID đó để hỏi Database thông tin chi tiết
        // để lấy thông tin mới nhất của account từ Database
        const user = await Account.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Lấy hết trừ cột password ra
        });

        if (!user) throw HttpError(404, 'User not found');

        res.status(200).json({ 
            message: 'User profile fetched successfully', 
            profile: user 
        });
    } catch (error) {
        next(error);
    }
};


exports.logout = (req, res, next) => {
    res.status(200).json({ message: 'Logout successful' });
};