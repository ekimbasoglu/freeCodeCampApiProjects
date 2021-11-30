const multer = require('multer');

const storage = multer.memoryStorage({
    destination(req, file, cb) {
        cb(null, '');
    },
});

// const filefilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(error.BAD_REQUEST, false);
//     }
// };

const upload = multer({ storage, limits: { fileSize: 12000000 } });

module.exports.multerHandler = (file) => upload.single(file);
