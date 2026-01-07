const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            // Thuộc về Bài học (N-1)
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
            type: DataTypes.STRING(255), // Lưu đáp án đúng (ví dụ: "A" hoặc "Cat")
            allowNull: false
        },
        // Khóa ngoại
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