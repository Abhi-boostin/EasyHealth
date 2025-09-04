import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10MB (pdf thoda bada ho sakta)
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") || file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image or PDF files are allowed!"), false);
    }
  },
});

export default upload;
