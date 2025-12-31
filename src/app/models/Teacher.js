const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Teacher extends Model {
        static associate(models) {
            // 1. QUAN HỆ TÀI KHOẢN (1-n)
            Teacher.hasMany(models.Account, {
                foreignKey: 'TEACHER_idTEACHER',
                as: 'accounts'
            });

            // 2. QUAN HỆ KHÓA HỌC (1-N)
            // Một giáo viên tạo nhiều khóa học
            Teacher.hasMany(models.Course, {
                foreignKey: 'idTEACHER',
                as: 'courses'
            });
        }
    }

    Teacher.init({
        idTEACHER: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        avatarUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phoneNumber: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        specialization: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        jobTitle: { 
            type: DataTypes.STRING(100),
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        nativeLanguage: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Teacher',
        tableName: 'TEACHERS',
        timestamps: false
    });

    return Teacher;
};