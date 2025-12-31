const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            // Account thuộc về 1 Learner
            Account.belongsTo(models.Learner, {
                foreignKey: 'LEARNER_idLEARNER',
                as: 'learnerInfo'
            });

            // Account thuộc về 1 Admin
            Account.belongsTo(models.Admin, {
                foreignKey: 'ADMIN_idADMIN',
                as: 'adminInfo'
            });

            // Account thuộc về 1 Teacher
            Account.belongsTo(models.Teacher, {
                foreignKey: 'TEACHER_idTEACHER',
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
        // Khóa ngoại trỏ về 3 bảng (cho phép Null vì 1 account chỉ thuộc 1 loại)
        LEARNER_idLEARNER: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'LEARNERS', key: 'idLEARNER' }
        },
        ADMIN_idADMIN: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'ADMINS', key: 'idADMIN' }
        },
        TEACHER_idTEACHER: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'TEACHERS', key: 'idTEACHER' }
        }
    }, {
        sequelize,
        modelName: 'Account',
        tableName: 'ACCOUNTS',
        timestamps: true,
        updatedAt: false, // SQL không có updatedAt
        createdAt: 'createdAt'
    });

    return Account;
};