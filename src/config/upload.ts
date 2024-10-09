import multer from 'fastify-multer'

const storage = multer.memoryStorage()

const uploadConfig = multer({
  storage,
  limits: { fileSize: 20000000 }, // 20 MB
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'))
    }
    cb(null, true)
  },
})

export { uploadConfig }
