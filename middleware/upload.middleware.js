import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only image files are allowed (JPG, JPEG, PNG)"));
  }
  cb(null, true);
};

const uploadPhoto = multer({ storage, fileFilter });

export default uploadPhoto;
