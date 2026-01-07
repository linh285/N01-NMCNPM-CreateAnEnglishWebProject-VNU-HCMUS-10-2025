const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {
        static associate(models) {
            // 1. Thuộc về Khóa học (N-1)
            Lesson.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });

            // 2. Chứa nhiều Câu hỏi (1-N)
            Lesson.hasMany(models.Question, {
                foreignKey: 'idLESSON',
                as: 'questions'
            });

            // 3. Có nhiều Kết quả luyện nói (1-N)
            Lesson.hasMany(models.SpeakingResult, {
                foreignKey: 'idLESSON',
                as: 'speakingResults'
            });
            
             // 4. Liên kết với Tiến độ học tập (1-N)
             Lesson.hasMany(models.LearningProgress, {
                foreignKey: 'LESSON_idLESSON',
                as: 'progressRecords'
            });
            // 5.
            Lesson.hasMany(models.TestSession, {
                foreignKey: 'LEARNER_idLESSON',
                as: 'testSessions'
            })
        }
    }

    Lesson.init({
        idLESSON: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        orderIndex: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contentType: {
            type: DataTypes.ENUM('Video', 'Reading', 'Quiz', 'Speaking', 'Writing', 'Pronunciation', 'Mixed', 'Other', 'Audio'),
            allowNull: false
        },
        mediaUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        textContent: {
            type: DataTypes.TEXT, 
            allowNull: true
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TRANSCRIPT: { 
            type: DataTypes.TEXT,
            allowNull: true
        },
        totalQuestions: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        learningType: {
            type: DataTypes.ENUM('Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing', 'Pronunciation'),
            allowNull: false
        },
        // Khóa ngoại
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'COURSES',
                key: 'idCOURSE'
            }
        }
    }, {
        sequelize,
        modelName: 'Lesson',
        tableName: 'LESSONS',
        timestamps: false
    });

    return Lesson;
};