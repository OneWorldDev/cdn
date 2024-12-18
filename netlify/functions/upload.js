const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Create a new incoming form
  const form = new formidable.IncomingForm();
  
  // Specify upload directory inside the function folder
  const uploadDir = path.join(__dirname, 'uploads');
  
  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  form.uploadDir = uploadDir; // Set the upload directory for files
  form.keepExtensions = true; // Keep the original file extensions

  return new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ message: 'Error parsing form' }),
        });
      }

      // Log fields and files for debugging
      console.log('Fields:', fields);
      console.log('Files:', files);

      if (!files.file || !files.file[0]) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'No file uploaded' }),
        });
      }

      const uploadedFile = files.file[0];
      const fileName = uploadedFile.originalFilename;
      const filePath = path.join(uploadDir, fileName);

      // Check for file type (Only accept .txt and .jpeg)
      if (uploadedFile.mimetype !== 'text/plain' && uploadedFile.mimetype !== 'image/jpeg') {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid file type. Only .txt and .jpeg files are allowed.' }),
        });
      }

      // Rename and move the uploaded file
      fs.rename(uploadedFile.filepath, filePath, (err) => {
        if (err) {
          console.error('Error moving file:', err);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving file' }),
          });
        }

        return resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'File uploaded successfully', filePath }),
        });
      });
    });
  });
};
