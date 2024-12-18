const fs = require('fs');
const path = require('path');
const formidable = require('formidable'); // Handle file uploads

exports.handler = async (event, context) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public');  // Save to the public folder
    form.keepExtensions = true;  // Preserve file extensions

    return new Promise((resolve, reject) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Error processing the file upload.' })
                });
                return;
            }

            const uploadedFile = files.file[0];
            const fileName = fields.fileName || uploadedFile.originalFilename; // Get the file name
            const newFilePath = path.join(form.uploadDir, fileName);

            // Move the file from temporary location to the public folder
            fs.renameSync(uploadedFile.filepath, newFilePath);

            resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'File uploaded successfully!' })
            });
        });
    });
};
