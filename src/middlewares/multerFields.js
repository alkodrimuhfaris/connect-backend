const multer = require('multer')
const path = require('path')
const responseStandard = require('../helpers/response')

const { MAX_FILE_SIZE } = process.env

module.exports = (data = [{ name: 'picture', maxCount: 1 }, { name: 'bodyGallery', maxCount: 8 }]) => {
  return (req, res, next) => {
    console.log('in multer')

    // storage
    const maxSize = MAX_FILE_SIZE * 1024
    const storage = multer.diskStorage({
      destination: (req, _file, cb) => {
        cb(null, './Assets/Public/Uploads')
      },
      filename: (req, file, cb) => {
        cb(null, req.user.id + '-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    })

    // function check File Type
    function checkFileType (file, cb) {
      const filetypes = /jpeg|jpg|png/i
      const extname = filetypes.test(path.extname(file.originalname))
      const mimetype = filetypes.test(file.mimetype)

      if (mimetype && extname) {
        return cb(null, true)
      } else {
        req.fileValidationError = 'You have wrong file type!'
        return cb(new Error(req.fileValidationError), false)
      }
    }

    // initial upload
    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
      },
      limits: { fileSize: maxSize }
    }).fields(data)

    upload(req, res, err => {
      if (err instanceof multer.MulterError) {
        console.log(err)
        console.log(data)
        return responseStandard(res, err.message, {}, 500, false)
      } else if (req.fileValidationError) {
        console.log(data)
        return responseStandard(res, req.fileValidationError, {}, 400, false)
      } else if (err) {
        console.log(data)
        return responseStandard(res, err.message, {}, 500, false)
      } else {
        console.log(data)
        return next()
      }
    })
  }
}
