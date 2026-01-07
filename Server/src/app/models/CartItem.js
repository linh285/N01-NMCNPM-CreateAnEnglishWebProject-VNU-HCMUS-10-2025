const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            // 1. Thuộc về Learner (N-1)
            CartItem.belongsTo(models.Learner, {
                foreignKey: 'idLEARNER',
                as: 'learner'
            });

            // 2. Thuộc về Course (N-1)
            CartItem.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });
        }
    }

    CartItem.init({
        idCART_ITEM: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        addedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        isSelected: {
            type: DataTypes.BOOLEAN, // SQL là TINYINT(1) -> Map sang Boolean
            defaultValue: true
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
        modelName: 'CartItem',
        tableName: 'CART_ITEMS', 
        timestamps: false
    });

    return CartItem;
};