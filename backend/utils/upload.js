import multer from 'multer';
import path from 'path';

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
        // Create a safe and short filename
        const fileName = file.originalname
            .toLowerCase()
            .split(' ')
            .join('-'); // Replace spaces with hyphens
        const uniqueSuffix = Date.now();
        cb(null, `${fileName}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter to allow only jpg, jpeg, and png
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, and .png formats are allowed!'));
    }
};

// Set up Multer with file size limit and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
    fileFilter: fileFilter
});

// Export upload as default
export default upload;
