const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            // 1. Người viết đánh giá (Learner)
            Review.belongsTo(models.Learner, {
                foreignKey: 'idLEARNER',
                as: 'learner'
            });

            // 2. Đánh giá cho khóa học nào (Course)
            Review.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });
        }
    }

    Review.init({
        idREVIEW: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rating: {
            type: DataTypes.INTEGER, // TINYINT trong SQL
            allowNull: false,
            validate: {
                min: 1,
                max: 5 
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
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
        modelName: 'Review',
        tableName: 'REVIEWS',
        timestamps: false // Đã có cột createdAt tự quản lý
    });

    return Review;
};