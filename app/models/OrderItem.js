const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            // 1. Thuộc về Hóa đơn nào (N-1)
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'idORDER',
                as: 'order'
            });

            // 2. Là khóa học nào (N-1)
            OrderItem.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });
        }
    }

    OrderItem.init({
        idORDER_ITEM: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        priceAtPurchase: { // QUAN TRỌNG: Lưu giá tại thời điểm mua
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        // Khóa ngoại
        idORDER: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'ORDERS', key: 'idORDER' }
        },
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'COURSES', key: 'idCOURSE' }
        }
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'ORDER_ITEMS',
        timestamps: false
    });

    return OrderItem;
};