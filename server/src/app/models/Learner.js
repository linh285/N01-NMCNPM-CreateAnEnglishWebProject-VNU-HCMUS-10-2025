const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Learner extends Model {
        static associate(models) {
            // 1. QUAN HỆ TÀI KHOẢN (1-n)
            Learner.hasMany(models.Account, {
                foreignKey: 'LEARNER_idLEARNER',
                as: 'accounts'
            });

            // 2. QUAN HỆ MUA SẮM (1-N)
            // Learner có nhiều dòng trong giỏ hàng
            Learner.hasMany(models.CartItem, {
                foreignKey: 'idLEARNER',
                as: 'cartItems'
            });
            // Learner có nhiều hóa đơn mua khóa học
            Learner.hasMany(models.Order, {
                foreignKey: 'idLEARNER',
                as: 'orders'
            });

            // 3. QUAN HỆ HỌC TẬP (1-N)
            // Learner đăng ký nhiều khóa học (Enrollment)
            Learner.hasMany(models.Enrollment, {
                foreignKey: 'idLEARNER',
                as: 'enrollments'
            });
            // Learner có nhiều kết quả bài nói (SpeakingResult)
            Learner.hasMany(models.SpeakingResult, {
                foreignKey: 'idLEARNER',
                as: 'speakingResults'
            });
             // Learner có nhiều buổi làm bài kiểm tra (TestSession)
             Learner.hasMany(models.TestSession, {
                foreignKey: 'LEARNER_idLEARNER', // Check đúng tên cột trong SQL
                as: 'testSessions'
            });

            // 4. QUAN HỆ TƯƠNG TÁC (1-N)
            // Learner viết nhiều đánh giá (Review)
            Learner.hasMany(models.Review, {
                foreignKey: 'idLEARNER',
                as: 'reviews'
            });
        }
    }

    Learner.init({
        idLEARNER: {
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
        currentXp: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        currentStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        englishLevel: {
            type: DataTypes.ENUM('Beginner', 'Elementary', 'Intermediate', 'Advanced', 'IELTS'),
            defaultValue: 'Beginner',
            allowNull: false
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
        phoneNumber: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        nativeLanguage: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Learner',
        tableName: 'LEARNERS',
        timestamps: false
    });

    return Learner;
};