import multer from "multer"
import path from "path"

import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
var baseUrl = "https://etsykrishnasai.herokuapp.com"
let fileName
const storage = multer.diskStorage({
  destination: __dirname + "/../../public/uploads/",
  filename: function (req, file, cb) {
    fileName = "IMAGE-" + Date.now() + path.extname(file.originalname)
    cb(null, fileName)
  },
})

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage")

function upload(req, res) {
  uploadFile(req, res, (err) => {
    if (!err) {
      return res.status(200).json({
        imageUrl: `${baseUrl}/file/${fileName}`,
      })
    }
  })
}

function getFile(req, res) {
  const filePath = `${__dirname}/../../public/uploads/${req.params.fileName}` // find out the filePath based on given fileName
  // res.sendFile(filePath);
  res.sendFile(path.resolve(filePath))
}

let endpoints = {
  "/upload": [
    {
      method: "POST",
      callbacks: [upload], // last index function is always a rest function
    },
  ],
  "/file/:fileName": [
    {
      method: "GET",
      callbacks: [getFile],
    },
  ],
}

export { endpoints }
