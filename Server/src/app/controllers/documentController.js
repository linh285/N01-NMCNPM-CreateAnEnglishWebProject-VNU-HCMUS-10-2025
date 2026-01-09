const { Document, Teacher, Course } = require('../models');
const HttpError = require('http-errors');
const fs = require('fs');
const path = require('path');

// 1. [POST] /documents/upload
exports.uploadDocument = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, description, courseId } = req.body;
        
        if (!req.file) {
            throw HttpError(400, 'No file uploaded');
        }

        // Find the Teacher profile associated with the user
        const teacher = await Teacher.findOne({ where: { idACCOUNT: userId } });
        if (!teacher) throw HttpError(403, 'Teacher profile not found');

        const newDoc = await Document.create({
            title: title || req.file.originalname,
            description,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            idTEACHER: teacher.idTEACHER,
            idCOURSE: courseId || null
        });

        res.status(201).json({
            status: 'success',
            data: newDoc
        });
    } catch (error) {
        next(error);
    }
};

// 2. [GET] /documents (Get all documents for the logged-in teacher)
exports.getTeacherDocuments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const teacher = await Teacher.findOne({ where: { idACCOUNT: userId } });
        if (!teacher) throw HttpError(403, 'Teacher profile not found');

        const documents = await Document.findAll({
            where: { idTEACHER: teacher.idTEACHER },
            include: [
                { model: Course, as: 'course', attributes: ['idCOURSE', 'title'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            count: documents.length,
            data: documents
        });
    } catch (error) {
        next(error);
    }
};

// 3. [DELETE] /documents/:id
exports.deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const teacher = await Teacher.findOne({ where: { idACCOUNT: userId } });
        const document = await Document.findByPk(id);

        if (!document) throw HttpError(404, 'Document not found');
        
        // Ensure ownership
        if (document.idTEACHER !== teacher.idTEACHER) {
            throw HttpError(403, 'Permission denied');
        }

        // Optional: Delete file from server
        // if (document.fileUrl && fs.existsSync(document.fileUrl)) {
        //     fs.unlinkSync(document.fileUrl);
        // }

        await document.destroy();

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
};