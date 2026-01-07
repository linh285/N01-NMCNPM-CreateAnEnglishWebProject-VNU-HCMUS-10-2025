const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            // Account thuộc về 1 Learner
            Account.hasOne(models.Learner, {
                foreignKey: 'idACCOUNT',
                as: 'learnerInfo'
            });

            // Account thuộc về 1 Admin
            Account.hasOne(models.Admin, {
                foreignKey: 'idACCOUNT',
                as: 'adminInfo'
            });

            // Account thuộc về 1 Teacher
            Account.hasOne(models.Teacher, {
                foreignKey: 'idACCOUNT',
                as: 'teacherInfo'
            });
        }
    }

    Account.init({
        idACCOUNT: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'TEACHER', 'LEARNER'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'banned', 'pending'),
            defaultValue: 'active'
        },
    }, {
        sequelize,
        modelName: 'Account',  // java
        tableName: 'ACCOUNTS',  // DB
        timestamps: true,
        updatedAt: false, // SQL không có updatedAt
        createdAt: 'createdAt'
    });

    return Account;
};
/*
   modelName: dùng trong codeJavascript
    tableName: dùng để khớp với bảng trong SQL
*/