const { Course, Learner, Enrollment, Teacher} = require('../models');
const HttpError = require('http-errors');

// 1. [POST] /enrollments
exports.createEnrollment = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const accountId = req.user.id;

        if (!courseId) {
            return next(HttpError(400, 'Course ID is required'));
        }

        // kiem tra khoa hoc ton tai
        const course = await Course.findByPk(courseId);
        if (!course) {
            return next(HttpError(404, 'Course not found'));
        }

        const learner = await Learner.findOne({
            where: { idACCOUNT: accountId }
        });
        if (!learner) {
            return next(HttpError(404, 'Learner profile not found'));
        }

        // kiem tra neu da dang ky khoa hoc
        const existingEnrollment = await Enrollment.findOne({ where: { idLEARNER: learner.idLEARNER, idCOURSE: courseId } });
        if (existingEnrollment) {
            return next(HttpError(409, 'Already enrolled in this course'));
        }
       
        const newEnrollment = await Enrollment.create({
            idLEARNER: learner.idLEARNER,
            idCOURSE: courseId,
            status: 'ACTIVE'
        });
        res.status(201).json(
            { 
                message: 'Enrollment created successfully', 
                data: newEnrollment 
            }
        );
    } catch(error) {
        next(error)
    }
};

// 2. [GET] /enrollments/check/:courseId
exports.getEnrollmentById = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        
        const learner = await Learner.findOne({
            where: { idACCOUNT: req.user.id }
        })
        if (!learner) {
            return next(HttpError(404, 'Learner profile not found'));
        }

        const course = await Course.findByPk(courseId);
        if (!course) {
            return next(HttpError(404, 'Course not found'));
        }

        const enrollment = await Enrollment.findOne({ 
            where: { idLEARNER: learner.idLEARNER, idCOURSE: courseId } 
        });

        res.status(200).json(
            { 
                isEnrolled: !!enrollment, 
                status: enrollment ? enrollment.status : null 
            }
        );
    } catch(error) {
        next(error);
    }
};

// 3. [GET] /enrollments/my-courses
exports.getAllEnrollments = async (req, res, next) => {
    try {
        const learner = await Learner.findOne({
            where: { idACCOUNT: req.user.id }
        });
        if (!learner) {
            return next(HttpError(404, 'Learner profile not found'));
        }
        const enrollments = await Enrollment.findAll({
            where: { idLEARNER: learner.idLEARNER },
            include: [
                { 
                    model: Course, as: 'course',
                    include: [
                        { 
                            model: Teacher, 
                            as: 'teacher', 
                            attributes: ['fullName', 'avatarUrl'] 
                        }
                    ]
                }
            ],
            order: [['enrolledAt', 'DESC']]
        });

        res.status(200).json(
            { 
                message: 'Enrollments retrieved successfully', 
                data: enrollments 
            }
        );
    } catch(error) {
        next(error);
    }

};

// 4. [GET] /enrollments/course/:courseId
exports.getStudentsByCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // 1. Check if course exists
        const course = await Course.findByPk(courseId);
        if (!course) {
            return next(HttpError(404, 'Course not found'));
        }

        // 2. Authorization: If Teacher, ensure they own the course
        if (userRole === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: userId } });
            if (!teacher || course.idTEACHER !== teacher.idTEACHER) {
                return next(HttpError(403, 'You do not have permission to view students of this course'));
            }
        }

        // 3. Fetch Enrollments with Learner info
        const enrollments = await Enrollment.findAll({
            where: { idCOURSE: courseId },
            include: [
                {
                    model: Learner,
                    as: 'learner',
                    attributes: ['idLEARNER', 'fullName', 'avatarUrl', 'email', 'englishLevel', 'phoneNumber']
                }
            ],
            order: [['enrolledAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            count: enrollments.length,
            data: enrollments
        });

    } catch (error) {
        next(error);
    }
};