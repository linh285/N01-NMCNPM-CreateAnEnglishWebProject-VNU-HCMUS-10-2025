const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TestSession extends Model {
        static associate(models) {
            // 1. Thuộc về Learner (N-1)
            TestSession.belongsTo(models.Learner, {
                foreignKey: 'LEARNER_idLEARNER', 
                as: 'learner'
            });

            // 2. Thuộc về Lesson (N-1) (Bài kiểm tra của bài học nào)
            TestSession.belongsTo(models.Lesson, {
                foreignKey: 'LESSON_idLESSON', 
                as: 'lesson'
            });
        }
    }

    TestSession.init({
        idTEST_SESSION: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        testPurpose: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        resultAnalysisJson: {
            type: DataTypes.JSON, // JSON
            allowNull: true
        },
        receiveResultEmail: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        submittedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        // Khóa ngoại
        LEARNER_idLEARNER: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LEARNERS', key: 'idLEARNER' }
        },
        LESSON_idLESSON: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LESSONS', key: 'idLESSON' }
        }
    }, {
        sequelize,
        modelName: 'TestSession',
        tableName: 'TEST_SESSIONS', 
        timestamps: false
    });

    return TestSession;
};