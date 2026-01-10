const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LearningProgress extends Model {
        static associate(models) {
            // 1. Thuộc về Enrollment (N-1)
            LearningProgress.belongsTo(models.Enrollment, {
                foreignKey: 'ENROLLMENT_idENROLLMENT',
                as: 'enrollment'
            });

            // 2. Thuộc về Lesson (N-1)
            LearningProgress.belongsTo(models.Lesson, {
                foreignKey: 'LESSON_idLESSON',
                as: 'lesson'
            });
        }
    }

    LearningProgress.init({
        idLEARNING_PROGRESS: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        lastVideoPosition: {
            type: DataTypes.INTEGER, // Lưu giây thứ mấy
            defaultValue: 0
        },
        lastAccessedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        // Khóa ngoại
        ENROLLMENT_idENROLLMENT: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'ENROLLMENTS', key: 'idENROLLMENT' }
        },
        LESSON_idLESSON: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LESSONS', key: 'idLESSON' }
        }
    }, {
        sequelize,
        modelName: 'LearningProgress',
        tableName: 'LEARNING_PROGRESS',
        timestamps: false
    });

    return LearningProgress;
};