const { Course, Teacher, Account} = require('../models');
const HttpError = require('http-errors');

// Hàm tạo mã khóa học ngẫu nhiên (Ví dụ: ENG-58392)
const generateCourseCode = () => {
    const prefix = 'ENG';
    const randomNum = Math.floor(10000 + Math.random() * 90000); 
    return `${prefix}-${randomNum}`;
};
// 1. [POST] /courses 
exports.createCourse = async (req, res, next) => {
    try {
        // 1. Lấy thông tin từ Token và body
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
            courseCode: newCourseCode, // tu dong dien
            category,
            syllabus,
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

// 2. [GET] /courses 
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.findAll(
            {
            include: [ 
                    {
                        model: Teacher,
                        as: 'teacher', 
                        attributes: ['fullName', 'avatarUrl', 'bio'],

                        // Lấy tiếp thông tin Account từ Teacher (Nested Include)
                        include: [{
                            model: Account,
                            as: 'account',
                            attributes: ['email'] 
                        }],
                    }
                ], 
                order: [['createdAt', 'DESC']] 
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

// 4. [PUT] /courses/:id 
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

        if (userRole !== 'ADMIN') {
            // cho phép Teacher cập nhật khóa học của c họ
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
        };
        if (userRole === 'TEACHER') {
            allowedUpdates.status = 'DRAFT'; 
        }

        // bỏ các trường undefined
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

// 5. [DELETE] /courses/:id 
exports.deleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const accountId = req.user.id;
        const userRole = req.user.role;

        const course = await Course.findByPk(courseId);
        if (!course) {
            throw HttpError(404, 'Course not found');
        }
        if (userRole !== 'ADMIN') {
            // Chỉ cho phép Teacher cập nhật khóa học của họ
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

// 6. [PUT] /courses/:idCOURSE/approve - Duyệt khóa học (ADMIN)
exports.approveCourse = async (req, res, next) => {
    try {
        const { idCOURSE } = req.params;
         // Admin gửi lên 'PUBLISHED', 'ARCHIVED' ban dau la DRAFT
        const { status } = req.body;

        const course = await Course.findByPk(idCOURSE);
        if (!course) throw HttpError(404, 'Course not found');
        if (!['PUBLISHED', 'ARCHIVED'].includes(status)) {
            throw HttpError(400, 'Invalid status value');
        }
    
        await course.update({ status: status });

        res.status(200).json({ message: `Course is now ${status}` });
    } catch (error) {
        next(error);
    }
};