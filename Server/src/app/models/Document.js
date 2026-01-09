const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Document extends Model {
        static associate(models) {
            // Document belongs to a Teacher (Owner)
            Document.belongsTo(models.Teacher, {
                foreignKey: 'idTEACHER',
                as: 'teacher'
            });
            
            // Optional: Link to a specific Course
            Document.belongsTo(models.Course, {
                foreignKey: 'idCOURSE',
                as: 'course'
            });
        }
    }

    Document.init({
        idDOCUMENT: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fileUrl: {
            type: DataTypes.STRING(2048),
            allowNull: false
        },
        fileType: {
            type: DataTypes.STRING(50), // e.g., 'application/pdf', 'audio/mpeg'
            allowNull: true
        },
        fileSize: {
            type: DataTypes.INTEGER, // bytes
            allowNull: true
        },
        idTEACHER: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idCOURSE: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Document',
        tableName: 'DOCUMENTS',
        timestamps: true
    });

    return Document;
};