const { Course, Teacher, Account} = require('../models');
const HttpError = require('http-errors');

// Hàm tạo mã khóa học ngẫu nhiên (Ví dụ: ENG-58392)
const generateCourseCode = () => {
    const prefix = 'ENG';
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 số ngẫu nhiên
    return `${prefix}-${randomNum}`;
};

exports.createCourse = async (req, res, next) => {
    try {
        // 1. Lấy thông tin từ Token (Đã qua middleware bảo vệ)
        const accountId = req.user.id; 
        const { title, description, price, level, type, category, syllabus } = req.body;


        if (!title) {
            throw HttpError(400, 'Missing required fields: title');
        }

        // 2. Kiem tra giao vien co ton tai hay khong
        const teacher = await Teacher.findOne({idACCOUNT: accountId});
        if (!teacher) {
            throw HttpError(404, 'Teacher not found');
        }

        const newCourseCode = generateCourseCode();

        // 3. Tao khoa hoc moi
        const newCourse = await Course.create({
            title,
            description,
            price: price || 0,
            level,
            type: type || 'Online',
            courseCode: newCourseCode, // Tự động điền
            category,
            syllabus,
            // QUAN TRỌNG: Gán đúng idTEACHER
            idTEACHER: teacher.idTEACHER 
        });

        res.status(201).json(
            {
                message: 'Course created successfully',
                data: {
                    course: newCourse
                }
            }
        );
    } catch (error) {
        next(error);
    }
};

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.findAll(
            {
            include: [ 
                    {
                        model: Teacher,
                        as: 'teacher', // Phải khớp với 'as' trong models/index.js
                        attributes: ['fullName', 'avatarUrl', 'bio'],

                        // Lấy tiếp thông tin Account từ Teacher (Nested Include)
                        include: [{
                            model: Account,
                            as: 'account',
                            attributes: ['email'] 
                        }],
                    }
                ], 
                order: [['createdAt', 'DESC']] // Sắp xếp khóa học mới nhất lên đầu
            }
        );

        res.status(200).json(
            {
                status: 'success',
                count: courses.length,
                courses
            }
        );

    } catch (error) {
        next(error);
    }
}