const { Course, Enrollment, Question, Document, Teacher, Sequelize } = require('../models');
const HttpError = require('http-errors');

exports.getTeacherStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Find Teacher ID
        const teacher = await Teacher.findOne({ where: { idACCOUNT: userId } });
        if (!teacher) throw HttpError(403, 'Teacher profile not found');
        const teacherId = teacher.idTEACHER;

        // 2. Fetch all stats in parallel for performance
        const [
            courseCount,
            studentCountResult,
            questionCount,
            documentCount
        ] = await Promise.all([
            // Count Courses
            Course.count({ where: { idTEACHER: teacherId } }),
            
            // Count Unique Students (via Enrollments in Teacher's courses)
            // This is a bit complex: We need distinct Learners enrolled in courses owned by this teacher
            Enrollment.count({
                distinct: true,
                col: 'idLEARNER',
                include: [{
                    model: Course,
                    as: 'course',
                    where: { idTEACHER: teacherId },
                    required: true,
                    attributes: [] // We don't need course data, just the filter
                }]
            }),

            // Count Questions (Owned by Teacher via Course)
            // Questions link to Course, so we check if the Course belongs to the Teacher
            Question.count({
                include: [{
                    model: Course,
                    as: 'course', // Ensure alias matches your Question model association
                    where: { idTEACHER: teacherId },
                    required: true
                }]
            }),

            // Count Documents
            Document.count({ where: { idTEACHER: teacherId } })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalCourses: courseCount,
                totalStudents: studentCountResult,
                totalQuestions: questionCount,
                totalDocuments: documentCount
            }
        });

    } catch (error) {
        next(error);
    }
};