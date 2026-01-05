const { Question, Lesson, Course, Teacher } = require('../models');
const HttpError = require('http-errors');

// 1. [POST] /questions (Tạo câu hỏi mới cho bài học)
exports.createQuestion = async (req, res, next) => {
    try {
        const { id: accountId, role } = req.user;
        const { lessonId, questionText, optionsJson, correctAnswer, mediaUrl } = req.body;

        // Validation
        if (!lessonId || !questionText || !optionsJson || !correctAnswer) {
            throw HttpError(400, 'Missing required fields (lessonId, questionText, optionsJson, correctAnswer)');
        }

        // Kiểm tra optionsJson có phải là mảng không
        if (!Array.isArray(optionsJson) || optionsJson.length < 2) {
            throw HttpError(400, 'optionsJson must be an array with at least 2 options');
        }

        // 1. Tìm Lesson và kèm theo Course để check quyền sở hữu
        const lesson = await Lesson.findByPk(lessonId, {
            include: [{ model: Course, as: 'course' }]
        });

        if (!lesson) throw HttpError(404, 'Lesson not found');

        // 2. Check quyền: Chỉ Teacher chủ sở hữu hoặc Admin mới được tạo
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You can only add questions to your own course');
            }
        }

        // 3. Tạo câu hỏi
        const newQuestion = await Question.create({
            idLESSON: lessonId,
            questionText,
            optionsJson,   // Sequelize tự động stringify mảng này khi lưu vào DB
            correctAnswer,
            mediaUrl       
        });

        res.status(201).json({
            message: 'Question created successfully',
            data: newQuestion
        });

    } catch (error) {
        next(error);
    }
};

// 2. [GET] /questions/lesson/:lessonId (Lấy danh sách câu hỏi của 1 bài học)
// Dùng cho cả Học viên (để làm bài) và Giáo viên (để xem lại)
exports.getQuestionsByLesson = async (req, res, next) => {
    try {
        const { lessonId } = req.params;

        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) throw HttpError(404, 'Lesson not found');

        const questions = await Question.findAll({
            where: { idLESSON: lessonId },
            // Không cần order vì thứ tự câu hỏi có thể random ở frontend
        });

        res.status(200).json({
            count: questions.length,
            data: questions
        });

    } catch (error) {
        next(error);
    }
};

// 3. [PUT] /questions/:id (Sửa câu hỏi)
exports.updateQuestion = async (req, res, next) => {
    try {
        const { idQuestion } = req.params;
        const { id: accountId, role } = req.user;
        const updates = req.body;

        const question = await Question.findByPk(idQuestion, {
            include: [
                {
                    model: Lesson,
                    as: 'lesson',
                    include: [{ model: Course, as: 'course' }] // de check quyen so huu
                }
            ]
        });

        if (!question) throw HttpError(404, 'Question not found');

        // Check quyền sở hữu
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || question.lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You can only edit questions in your own course');
            }
        }

        await question.update(updates);

        res.status(200).json({
            message: 'Question updated successfully',
            data: question
        });

    } catch (error) {
        next(error);
    }
};

// 4. [DELETE] /questions/:id (Xóa câu hỏi)
exports.deleteQuestion = async (req, res, next) => {
    try {
        const { idQuestion } = req.params;
        const { id: accountId, role } = req.user;

        const question = await Question.findByPk(idQuestion, {
            include: [
                {
                    model: Lesson,
                    as: 'lesson',
                    include: [{ model: Course, as: 'course' }]
                }
            ]
        });

        if (!question) throw HttpError(404, 'Question not found');

        // Check quyền sở hữu
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || question.lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You can only delete questions in your own course');
            }
        }

        await question.destroy();

        res.status(200).json({ message: 'Question deleted successfully' });

    } catch (error) {
        next(error);
    }
};