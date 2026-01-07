const { Question, Lesson, Course, Teacher } = require('../models');
const HttpError = require('http-errors');

// 1. [POST] /questions 
exports.createQuestion = async (req, res, next) => {
    try {
        const { id: accountId, role } = req.user;
        const { lessonId, questionText, optionsJson, correctAnswer } = req.body;
        
        // 1. Xử lý File Upload
        const mediaUrl = req.file ? req.file.path : null;

        if (!lessonId || !questionText || !optionsJson || !correctAnswer) {
            throw HttpError(400, 'Missing required fields');
        }

        // 2. // Nếu là string (do multipart gửi lên) thì parse, nếu là object (json thường) thì giữ nguyên
        let parsedOptions;
        try {
            parsedOptions = typeof optionsJson === 'string' ? JSON.parse(optionsJson) : optionsJson;
        } catch (e) {
            throw HttpError(400, 'optionsJson must be a valid JSON string');
        }

        // 3. Validate optionsJson
        if (!Array.isArray(parsedOptions) || parsedOptions.length < 2) {
            throw HttpError(400, 'optionsJson must be an array with at least 2 options');
        }

        // 4. Check quyền 
        const lesson = await Lesson.findByPk(lessonId, {
            include: [{ model: Course, as: 'course' }]
        });
        if (!lesson) throw HttpError(404, 'Lesson not found');

        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You can only add questions to your own course');
            }
        }

        const newQuestion = await Question.create({
            idLESSON: lessonId,
            questionText,
            optionsJson: parsedOptions, 
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

// 2. [GET] /questions/lesson/:lessonId 
exports.getQuestionsByLesson = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const { role } = req.user; 

        // MAC DINH lay het
        let attributesOption = {}; 
        if (role === 'LEARNER') {
            attributesOption = { exclude: ['correctAnswer'] }; // Giấu đáp án đi
        }

        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) throw HttpError(404, 'Lesson not found');

        const questions = await Question.findAll({
            where: { idLESSON: lessonId },
            attributes: attributesOption
        });

        res.status(200).json({
            count: questions.length,
            data: questions
        });

    } catch (error) {
        next(error);
    }
};

// 3. [PUT] /questions/:idQuestion
exports.updateQuestion = async (req, res, next) => {
    try {
        const { idQuestion } = req.params; 
        const { id: accountId, role } = req.user;
        const { questionText, optionsJson, correctAnswer } = req.body;
        
        // Lấy thông tin Question cũ để check quyền và lấy ảnh cũ
        const question = await Question.findByPk(idQuestion, {
            include: [{
                model: Lesson,
                as: 'lesson',
                include: [{ model: Course, as: 'course' }] 
            }]
        });

        if (!question) throw HttpError(404, 'Question not found');

        // Check quyền
        if (role === 'TEACHER') {
            const teacher = await Teacher.findOne({ where: { idACCOUNT: accountId } });
            if (!teacher || question.lesson.course.idTEACHER !== teacher.idTEACHER) {
                throw HttpError(403, 'You can only edit questions in your own course');
            }
        }

        const updates = {};
        if (questionText) updates.questionText = questionText;
        if (correctAnswer) updates.correctAnswer = correctAnswer;

        // nếu có upload thì lấy link mới, không thì thôi
        if (req.file) {
            updates.mediaUrl = req.file.path;
        }

        // nếu có gửi lên thì phải parse lại
        if (optionsJson) {
            try {
                const parsed = typeof optionsJson === 'string' ? JSON.parse(optionsJson) : optionsJson;
                if (!Array.isArray(parsed) || parsed.length < 2) throw new Error();
                updates.optionsJson = parsed;
            } catch (e) {
                throw HttpError(400, 'Invalid optionsJson format');
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

// 4. [DELETE] /questions/:id 
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