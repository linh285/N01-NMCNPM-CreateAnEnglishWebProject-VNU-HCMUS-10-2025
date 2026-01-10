const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Enrollment extends Model {
        static associate(models) {
            // 1. Thuộc về Learner (N-1)
            Enrollment.belongsTo(models.Learner, {
                foreignKey: 'idLEARNER',
                as: 'learner'
            });

            // 2. Thuộc về Course (N-1)
            Enrollment.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });

            // 3. Có nhiều tiến độ học tập (1-N)
            Enrollment.hasMany(models.LearningProgress, {
                foreignKey: 'ENROLLMENT_idENROLLMENT', 
                as: 'progressRecords'
            });
        }
    }

    Enrollment.init({
        idENROLLMENT: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enrolledAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'EXPIRED'),
            defaultValue: 'ACTIVE'
        },
        progressPercent: {
            type: DataTypes.DECIMAL(5, 2), // Lưu phần trăm hoàn thành (ví dụ: 50.50%)
            defaultValue: 0.00
        },
        // Khóa ngoại
        idLEARNER: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LEARNERS', key: 'idLEARNER' }
        },
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'COURSES', key: 'idCOURSE' }
        }
    }, {
        sequelize,
        modelName: 'Enrollment',
        tableName: 'ENROLLMENTS',
        timestamps: false
    });

    return Enrollment;
};