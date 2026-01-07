const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            // 1. Thuộc về Learner (N-1)
            Order.belongsTo(models.Learner, {
                foreignKey: 'idLEARNER',
                as: 'learner'
            });

            // 2. Có nhiều dòng chi tiết hóa đơn (1-N)
            Order.hasMany(models.OrderItem, {
                foreignKey: 'idORDER',
                as: 'items'
            });
        }
    }

    Order.init({
        idORDER: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        subTotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        discountCode: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        paymentMethod: {
            type: DataTypes.STRING(50), // Ví dụ: 'Momo', 'Bank Transfer'
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Paid', 'Failed'), // Khớp với ENUM trong SQL
            defaultValue: 'Pending'
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
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'ORDERS',
        timestamps: false
    });

    return Order;
};