const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'uploads');
  form.keepExtensions = true;

  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir);
  }

  // Log the incoming event for debugging purposes
  console.log("Incoming event:", event);

  return new Promise((resolve, reject) => {
    // Parse the form data
    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ message: 'Error parsing the form' })
        });
      }

      // Log the files and fields for debugging
      console.log("Fields:", fields);
      console.log("Files:", files);

      // Ensure the file is uploaded
      if (!files.file || !files.file[0]) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'No file uploaded' })
        });
      }

      const uploadedFile = files.file[0];
      const fileName = uploadedFile.originalFilename;
      const fileType = uploadedFile.mimetype;

      // Check if the file is either a .txt or .jpeg file
      if (fileType !== 'text/plain' && fileType !== 'image/jpeg') {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid file type. Only .txt and .jpeg are allowed.' })
        });
      }

      // Move the file to the uploads directory
      const filePath = path.join(form.uploadDir, fileName);
      fs.rename(uploadedFile.filepath, filePath, (err) => {
        if (err) {
          console.error("Error moving the file:", err);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving file' })
          });
        }

        console.log(`File uploaded successfully: ${filePath}`);
        return resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'File uploaded successfully', filePath: filePath })
        });
      });
    });
  });
};
