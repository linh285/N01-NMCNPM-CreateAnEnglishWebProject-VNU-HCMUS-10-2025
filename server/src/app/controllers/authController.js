const { Account, Learner, Teacher, Admin } = require('../models');
const HttpError = require('http-errors');
const { signAuth } = require('../middlewares/authMiddleware');
const bcrypt = require('bcryptjs'); 

exports.register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        
        // 1. Validate 
        if (!email || !password) throw HttpError(400, 'Email and Password are required');

        const existingUser = await Account.findOne({ where: { email } });
        if (existingUser) throw HttpError(409, 'Email already exists');

        // 2. ma hoa mk -> tao account
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        
        // Xác định vai trò và bảng profile tương ứng
        let finalRole;
        let userRole = role ? role.toUpperCase() : 'LEARNER';
        if (userRole === 'TEACHER') {
            finalRole = 'TEACHER';
        } else if (userRole === 'ADMIN') {
            finalRole = 'ADMIN';
        } else {
            finalRole = 'LEARNER';
        }
        
        const newUser = await Account.create({ 
            email, 
            password: hashedPassword, // Lưu cái đã băm, KHÔNG lưu password gốc
            role: finalRole, 
            status : 'active'
        });


        // 3. tao profile
        let userProfile = null;
        if (userRole === 'LEARNER') {
            userProfile = await Learner.create (
                {
                    idACCOUNT: newUser.idACCOUNT,
                    fullName: email.split('@')[0],
                    avatarUrl: null,
                    gender: null,
                    dateOfBirth: null,
                    address: null,
                    phoneNumber: null,
                    nativeLanguage: null,
                    englishLevel: 'A2',
                    avatarUrl: null
                }
            );
        } else if (userRole === 'TEACHER') {
            userProfile = await Teacher.create (
                {
                    idACCOUNT: newUser.idACCOUNT,
                    fullName: email.split('@')[0],
                    bio: 'New teacher',
                    phoneNumber: null,
                    specialization: null,
                    jobTitle: null,
                    gender: null,
                    address: null,
                    nativeLanguage: null,
                    dateOfBirth: null,
                    avatarUrl: null
                }
            )
        } else if (userRole === 'ADMIN') {
            userProfile = await Admin.create (
                {
                    idACCOUNT: newUser.idACCOUNT,
                    fullName: email.split('@')[0],
                    avatarUrl: null,
                }
            )
        }

        // 4. tao token
        const token = signAuth(newUser);
        
        res.status(201).json({ 
            message: 'Registration successful', 
            user: { id: newUser.idACCOUNT, email: newUser.email, role: newUser.role }, 
            profile: userProfile,
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

        if (!user) {
            throw HttpError(401, 'Invalid email or password');
        }

        if (user.status !== 'active') { 
            throw HttpError(403, 'Your account has been locked or is pending approval.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw HttpError(401, 'Invalid email or password');
        }

        // --- NEW CODE START ---
        // Fetch specific profile to get ID (idTEACHER, idLEARNER)
        let profile = null;
        if (user.role === 'TEACHER') {
            profile = await Teacher.findOne({ where: { idACCOUNT: user.idACCOUNT } });
        } else if (user.role === 'LEARNER') {
            profile = await Learner.findOne({ where: { idACCOUNT: user.idACCOUNT } });
        } else if (user.role === 'ADMIN') {
            profile = await Admin.findOne({ where: { idACCOUNT: user.idACCOUNT } });
        }

        const token = signAuth(user);
        
        // Return profile data combined with user info
        res.status(200).json({ 
            message: 'Login successful', 
            user: { 
                id: user.idACCOUNT, 
                email: user.email, 
                role: user.role,
                teacherId: profile?.idTEACHER, 
                learnerId: profile?.idLEARNER, 
                name: profile?.fullName 
            }, 
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
        
        const {id, role} = req.user;

        // cau hinh join bang de lay profile
        let includeOptions = [];
        if (role === 'LEARNER') {
            includeOptions = [{ model: Learner, as: 'learnerProfile' }];
        } else if (role === 'TEACHER') {
            includeOptions = [{ model: Teacher, as: 'teacherProfile' }];
        } else if (role === 'ADMIN') {
            includeOptions = [{ model: Admin, as: 'adminProfile' }];
        }

        const user = await Account.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: includeOptions // kem them profile
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