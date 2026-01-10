const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            // [NEW] 1. Thuộc về Khóa học (Question Bank của khóa học)
            Question.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });

            // 2. Thuộc về Bài học (Optional - nếu câu hỏi được gán vào bài học cụ thể)
            Question.belongsTo(models.Lesson, {
                foreignKey: 'idLESSON',
                as: 'lesson'
            });
        }
    }

    Question.init({
        idQUESTION: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        questionText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        mediaUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        optionsJson: {
            type: DataTypes.JSON, // Lưu mảng ["A. Cat", "B. Dog"...]
            allowNull: false
        },
        correctAnswer: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        // [NEW] Khóa ngoại Course (Bắt buộc để biết câu hỏi thuộc ngân hàng nào)
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            references: {
                model: 'COURSES',
                key: 'idCOURSE'
            }
        },
        // Khóa ngoại Lesson (Có thể Null nếu câu hỏi chỉ nằm trong Bank)
        idLESSON: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'LESSONS', key: 'idLESSON' }
        }
    }, {
        sequelize,
        modelName: 'Question',
        tableName: 'QUESTIONS',
        timestamps: false
    });

    return Question;
};