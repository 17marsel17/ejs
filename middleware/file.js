
import multer from 'multer'

export const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'load');
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/msword'){
            cb(null, true);
        } else {
            cb(null, false);
        }
}


