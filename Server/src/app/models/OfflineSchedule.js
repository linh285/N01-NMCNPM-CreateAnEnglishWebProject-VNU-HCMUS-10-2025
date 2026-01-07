const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OfflineSchedule extends Model {
        static associate(models) {
            // Thuộc về Khóa học (1-1)
            OfflineSchedule.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });
        }
    }

    OfflineSchedule.init({
        idOFFLINE_SCHEDULE: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE, // Ngày giờ bắt đầu khai giảng
            allowNull: false
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30
        },
        syllabus: {
            type: DataTypes.TEXT, // Đề cương khóa học offline
            allowNull: true
        },
        // Khóa ngoại
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'COURSES', key: 'idCOURSE' }
        }
    }, {
        sequelize,
        modelName: 'OfflineSchedule',
        tableName: 'OFFLINE_SCHEDULE', 
        timestamps: false
    });

    return OfflineSchedule;
};