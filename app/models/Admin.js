const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            // Admin sở hữu 1 tài khoản đăng nhập (1-1)
            Admin.belongsTo(models.Account, {
                foreignKey: 'idACCOUNT',
                as: 'account'
            });
        }
    }

    Admin.init({
        idADMIN: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING(100),
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
        avatarUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        // FK
        idACCOUNT: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'ACCOUNTS', key: 'idACCOUNT' }
        }
    }, 
    {
        sequelize,
        modelName: 'Admin',
        tableName: 'ADMINS', // Khớp tên bảng trong SQL
        timestamps: false
    });

    return Admin;
};