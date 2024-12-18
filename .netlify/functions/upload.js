const formidable = require('formidable');
const fs = require('fs');

exports.handler = async function(event, context) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(event.body, (err, fields, files) => {
      if (err) {
        return resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Error parsing the form' }),
        });
      }

      // Check if file exists
      if (!files.upload || !files.upload[0]) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'No file uploaded' }),
        });
      }

      const uploadedFile = files.upload[0];
      const fileName = uploadedFile.originalFilename;
      const fileType = uploadedFile.mimetype;

      // Check if the file is either a .txt or .jpeg file
      if (fileType !== 'text/plain' && fileType !== 'image/jpeg') {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid file type. Only .txt and .jpeg are allowed.' }),
        });
      }

      // Save file to a specific directory (optional)
      const uploadDir = './uploads'; // You can change this to a specific directory
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const filePath = `${uploadDir}/${fileName}`;
      fs.rename(uploadedFile.filepath, filePath, (err) => {
        if (err) {
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving file' }),
          });
        }

        return resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'File uploaded successfully', filePath }),
        });
      });
    });
  });
};
