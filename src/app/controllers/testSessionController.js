const { TestSession, Question, Learner, Lesson, Enrollment } = require('../models');
const HttpError = require('http-errors');

// 1. [POST] /test-sessions/submit (Nộp bài, Chấm điểm và Lưu kết quả)
exports.submitTest = async (req, res, next) => {
    try {
        const { id: accountId } = req.user;
        const { lessonId, userAnswers, testPurpose, receiveResultEmail } = req.body;
        // userAnswers format: { "questionId_1": "A", "questionId_2": "B" }

        if (!lessonId || !userAnswers) {
            throw HttpError(400, 'Lesson ID and User Answers are required');
        }

        // 1. Tìm Learner
        const learner = await Learner.findOne({ where: { idACCOUNT: accountId } });
        if (!learner) throw HttpError(404, 'Learner not found');

        // 2. Check Enrollment (Phải mua khóa học mới được thi)
        const lesson = await Lesson.findByPk(lessonId);
        if (!lesson) throw HttpError(404, 'Lesson not found');

        const isEnrolled = await Enrollment.findOne({
            where: { idLEARNER: learner.idLEARNER, idCOURSE: lesson.idCOURSE }
        });
        if (!isEnrolled) throw HttpError(403, 'You must enroll in the course to take this test');

        // 3. Lấy danh sách câu hỏi và đáp án đúng
        const questions = await Question.findAll({
            where: { idLESSON: lessonId }
        });

        if (questions.length === 0) throw HttpError(404, 'No questions found for this lesson');

        // 4. thuật toán cham điem
        let correctCount = 0;
        const totalQuestions = questions.length;
        const analysisDetails = []; // Mảng này sẽ lưu vào cột resultAnalysisJson

        questions.forEach(q => {
            // Đáp án user chọn
            const userAnswer = userAnswers[q.idQUESTION]; 
             // So sánh với đáp án đúng
            const isCorrect = userAnswer === q.correctAnswer;

            if (isCorrect) correctCount++;

            // Tạo log chi tiết cho từng câu
            analysisDetails.push({
                questionId: q.idQUESTION,
                questionText: q.questionText,
                userAnswer: userAnswer || null,
                correctAnswer: q.correctAnswer,
                isCorrect: isCorrect
            });
        });

        // Tính điểm (Thang 100 )
        const score = Math.round((correctCount / totalQuestions) * 100);

        // 5. Lưu vào TestSession
        const newSession = await TestSession.create({
            LEARNER_idLEARNER: learner.idLEARNER, 
            LESSON_idLESSON: lessonId,          
            testPurpose: testPurpose || 'Practice',
            score: score,
            resultAnalysisJson: analysisDetails, // mảng JSON
            receiveResultEmail: receiveResultEmail || null,
            submittedAt: new Date()
        });

        res.status(201).json({
            message: 'Test submitted and saved successfully',
            score: score,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            data: newSession
        });

    } catch (error) {
        next(error);
    }
};

// 2. [GET] /test-sessions/lesson/:lessonId (Xem lịch sử thi của bài học này)
exports.getHistoryByLesson = async (req, res, next) => {
    try {
        const { id: accountId } = req.user;
        const { lessonId } = req.params;

        const learner = await Learner.findOne({ where: { idACCOUNT: accountId } });

        const history = await TestSession.findAll({
            where: {
                LEARNER_idLEARNER: learner.idLEARNER,
                LESSON_idLESSON: lessonId
            },
            order: [['submittedAt', 'DESC']],
            attributes: ['idTEST_SESSION', 'score', 'submittedAt', 'testPurpose']
        });

        res.status(200).json({
            count: history.length,
            data: history
        });

    } catch (error) {
        next(error);
    }
};

// 3. [GET] /testSessions/:idTEST_SESSION (Xem chi tiết 1 bài thi cụ thể - xem lại lỗi sai)
exports.getSessionDetail = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { id: accountId } = req.user;

        const learner = await Learner.findOne({ where: { idACCOUNT: accountId } });

        const session = await TestSession.findByPk(id);

        if (!session) throw HttpError(404, 'Test session not found');

        // Check chính chủ
        if (session.LEARNER_idLEARNER !== learner.idLEARNER) {
            throw HttpError(403, 'You can only view your own test results');
        }

        res.status(200).json({ data: session });

    } catch (error) {
        next(error);
    }
};