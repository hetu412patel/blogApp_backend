const multer = require('multer')
const uuid = require('uuid').v4

const Storage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, 'images'),
    filename: (req, file, cb) => {
        const {originalname} = file
        cb(null, `${uuid()}-${originalname}`) 
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.split('/')[0] === 'image'){
        cb(null, true)
    }else{
        cb(new Error("File is not correct type"), false)
    }
}

const upload = multer({ storage: Storage , fileFilter: fileFilter})

module.exports = {upload}