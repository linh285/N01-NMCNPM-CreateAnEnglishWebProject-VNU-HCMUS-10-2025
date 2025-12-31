const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            // 1. Thuộc về Giáo viên (N-1)
            Course.belongsTo(models.Teacher, {
                foreignKey: 'idTEACHER',
                as: 'teacher'
            });

            // 2. Có lịch học Offline (1-n)
            Course.hasMany(models.OfflineSchedule, {
                foreignKey: 'idCOURSE',
                as: 'offlineSchedule'
            });

            // 3. Có nhiều bài học (Online)
            Course.hasMany(models.Lesson, {
                foreignKey: 'idCOURSE',
                as: 'lessons'
            });

            // 4. Có nhiều lượt đăng ký học
            Course.hasMany(models.Enrollment, {
                foreignKey: 'idCOURSE',
                as: 'enrollments'
            });

            // 5. Có nhiều Review
            Course.hasMany(models.Review, {
                foreignKey: 'idCOURSE',
                as: 'reviews'
            });
            // 6. CART_ITEMS (1-N)
            Course.hasMany(models.CartItem, {
                foreignKey: 'idCOURSE',
                as: 'cartItems'
            });
            // 7. ORDER_ITEMS (1-n)
            Course.hasMany(models.OrderItem, {
                foreignKey: 'idCOURSE',
                as: 'orderItems'
            })
        }
    }

    Course.init({
        idCOURSE: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        },
        type: {
            type: DataTypes.ENUM('Online', 'Offline'),
            allowNull: false,
            defaultValue: 'Online'
        },
        status: {
            type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
            defaultValue: 'DRAFT'
        },
        thumbnailUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        level: {
            type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
            allowNull: false,
            defaultValue: 'A2'
        },
        courseCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        category: {
            type: DataTypes.STRING(100)
        },
        syllabus: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Khóa ngoại
        idTEACHER: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'TEACHERS', key: 'idTEACHER' }
        }
    }, {
        sequelize,
        modelName: 'Course',
        tableName: 'COURSES',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false
    });

    return Course;
};