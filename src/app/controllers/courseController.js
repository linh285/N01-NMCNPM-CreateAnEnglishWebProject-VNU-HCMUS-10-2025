const { Course, Teacher, Account} = require('../models');
const HttpError = require('http-errors');

// Hàm tạo mã khóa học ngẫu nhiên (Ví dụ: ENG-58392)
const generateCourseCode = () => {
    const prefix = 'ENG';
    const randomNum = Math.floor(10000 + Math.random() * 90000); 
    return `${prefix}-${randomNum}`;
};
// 1. [POST] /courses - Tạo khóa học mới
exports.createCourse = async (req, res, next) => {
    try {
        // 1. Lấy thông tin từ Token (Đã qua middleware bảo vệ)
        const accountId = req.user.id; 
        const { title, description, price, level, type, category, syllabus } = req.body;


        if (!title) {
            throw HttpError(400, 'Missing required fields: title');
        }

        // 2. Kiem tra giao vien co ton tai hay khong
        const teacher = await Teacher.findOne(
            {where: {idACCOUNT: accountId}}
        );
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

// 2. [GET] /courses - Lấy tất cả khóa học
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
                data: {
                    courses
                }
            }
        );

    } catch (error) {
        next(error);
    }
}

// 3. [GET] /courses/:id - Lấy thông tin khóa học theo ID
exports.getCourseById = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId, {
            include: [ 
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['fullName', 'avatarUrl', 'bio'],
                    include: [{
                        model: Account,
                        as: 'account',
                        attributes: ['email']
                    }],
                }
            ]
        });
        if (!course) {
            throw HttpError(404, 'Course not found');
        }
        res.status(200).json({
            status: 'success',
            data: {
                course
            }
        });
    } catch (error) {
        next(error);
    }
};

// 4. [PUT] /courses/:id - Cập nhật thông tin khóa học
exports.updateCourse = async (req, res, next) => {
    try {
        const accountId = req.user.id;
        const userRole = req.user.role;

        const courseId = req.params.id;
        const updates= req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw HttpError(404, 'Course not found');
        }

        if( userRole === 'TEACHER' ) {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You do not have permission to update this course');
            }
        }

        // Chỉ cho phép update các trường an toàn (tránh bị hack đổi idTEACHER)
        const allowedUpdates = {
            title: updates.title,
            description: updates.description,
            price: updates.price,
            level: updates.level,
            type: updates.type,
            category: updates.category,
            syllabus: updates.syllabus,
            thumbnailUrl: updates.thumbnailUrl,
            status: updates.status
        };

        // Loại bỏ các trường undefined
        Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

        await course.update(allowedUpdates);

        res.status(200).json({
            message: 'Course updated successfully',
            data: {
                course
            }
        });
    } catch (error) {
        next(error);
    }
};

// 5. [DELETE] /courses/:id - Xóa khóa học
exports.deleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const accountId = req.user.id;
        const userRole = req.user.role;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw HttpError(404, 'Course not found');
        }
        if( userRole === 'TEACHER' ) {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You do not have permission to delete this course');
            }
        }
        
        await course.destroy();
        res.status(200).json({
            message: 'Course deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};