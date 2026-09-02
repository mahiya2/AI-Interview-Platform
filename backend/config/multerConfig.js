   const multer = require('multer');
   const path = require('path');

   // Define where and how to store uploaded files
   const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'uploads/'); // save files into the "uploads" folder
     },
     filename: (req, file, cb) => {
       // Create a unique filename: timestamp + original extension (e.g. .pdf)
       const uniqueName = Date.now() + path.extname(file.originalname);
       cb(null, uniqueName);
     },
   });

   // Only allow PDF files
   const fileFilter = (req, file, cb) => {
     if (file.mimetype === 'application/pdf') {
       cb(null, true);
     } else {
       cb(new Error('Only PDF files are allowed'), false);
     }
   };

   const upload = multer({ storage, fileFilter });

   module.exports = upload;