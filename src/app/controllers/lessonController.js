const { Teacher, Lesson, Course } = require('../models');
const HttpError = require('http-errors');

// 1. POST /api/v1/lessons/:courseId (Tạo bài học mới)
exports.createLesson = async (req, res, next) => {
    try {
        const { id: accountId, role } = req.user; 
        const { courseId } = req.params;
        const { title, orderIndex, contentType, durationMinutes, learningType, videoUrl, content, isPreview } = req.body;

        if (!title || !contentType || !durationMinutes || !learningType) throw HttpError(400, 'Missing required fields');

        const course = await Course.findByPk(courseId);
        if (!course) throw HttpError(404, 'Course not found');

        if (role !== 'ADMIN') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            
            if (!teacher) throw HttpError(404, 'Teacher not found');
            
            // Teacher chỉ được thêm bài vào khóa học của chính mình
            if (course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You are not the owner of this course');
            }
        }

        // Tự động tính orderIndex
        const lastLesson = await Lesson.findOne({
            where: { idCOURSE: courseId },
            order: [['orderIndex', 'DESC']]
        });

        const newOrderIndex = lastLesson ? lastLesson.orderIndex + 1 : 1;

        const newLesson = await Lesson.create({
            idCOURSE: courseId,
            title,
            orderIndex: newOrderIndex,
            contentType,
            durationMinutes: durationMinutes || 0,
            learningType,
            videoUrl,
            content,
            isPreview: isPreview || false,
        });

        res.status(201).json({
            message: 'Lesson created successfully',
            data: newLesson
        });
    } catch (error) {
        next(error);
    }
};

// 2. PUT /api/v1/lessons/:id 
exports.updateLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { id: accountId, role } = req.user;

        const lesson = await Lesson.findByPk(id, {
            include: [{
                model: Course,
                as: 'course',
            }]
        });
        if (!lesson) throw HttpError(404, 'Lesson not found');

        // Chỉ kiểm tra chủ sở hữu nếu là TEACHER
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher) throw HttpError(404, 'Teacher not found');
            
            if (lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You are not the owner of this course');
            }
        }
        // neu la admin thi bo qua
        await lesson.update({
            title: updates.title,
            durationMinutes: updates.durationMinutes,
            type: updates.type,
            videoUrl: updates.videoUrl,
            content: updates.content,
            isPreview: updates.isPreview
        });

        res.status(200).json({
            message: 'Lesson updated successfully',
            data: lesson
        });
    } catch (error) {
        next(error);
    }
};

// 3. DELETE /api/v1/lessons/:id 
exports.deleteLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: accountId, role } = req.user;

        const lesson = await Lesson.findByPk(id, {
            include: [{
                model: Course,
                as: 'course',
            }]
        });
        if (!lesson) throw HttpError(404, 'Lesson not found');

        // Chỉ kiểm tra chủ sở hữu nếu là TEACHER
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher) throw HttpError(404, 'Teacher not found');

            if (lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You are not the owner of this course');
            }
        }
        // admin được quyền xóa

        await lesson.destroy();

        res.status(200).json({
            message: 'Lesson deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};


// 4. GET /api/v1/lessons/:id 
exports.getLessonById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findByPk(id);
        if (!lesson) throw HttpError(404, 'Lesson not found');
        res.status(200).json(
            { 
                message: 'Lesson retrieved successfully',
                data: lesson
            }
        );
    } catch (error) {
        next(error);
    }   
};

// 5. GET /api/v1/courses/:courseId/lessons 
exports.getLessonsByCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const lessons = await Lesson.findAll({ 
            where: { idCOURSE: courseId }, 
            order: [['orderIndex', 'ASC']]
        });

        res.status(200).json(
            { 
                message: 'Lessons retrieved successfully',
                count: lessons.length,
                data: lessons 
            }
        );
    } catch (error) {
        next(error);
    }
};