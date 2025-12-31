const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SpeakingResult extends Model {
        static associate(models) {
            // 1. Bài làm của Learner nào? (N-1)
            SpeakingResult.belongsTo(models.Learner, {
                foreignKey: 'idLEARNER',
                as: 'learner'
            });

            // 2. Thuộc về Bài học nào? (N-1)
            SpeakingResult.belongsTo(models.Lesson, {
                foreignKey: 'idLESSON',
                as: 'lesson'
            });
        }
    }

    SpeakingResult.init({
        idSPEAKING_RESULT: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        aiScore: {
            type: DataTypes.FLOAT, 
            allowNull: true
        },
        aiFeedback: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        userAudioUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        submittedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        // Khóa ngoại
        idLEARNER: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LEARNERS', key: 'idLEARNER' }
        },
        idLESSON: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'LESSONS', key: 'idLESSON' }
        }
    }, {
        sequelize,
        modelName: 'SpeakingResult',
        tableName: 'SPEAKING_RESULTS',
        timestamps: false // Vì đã có cột submittedAt tự quản lý rồi
    });

    return SpeakingResult;
};