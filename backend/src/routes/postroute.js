const express = require('express');
const multer = require('multer');
const router = express.Router();
const {AddPost} = require('../controllers/PostController');
const {GetPost} = require('../controllers/PostController');
const {DeletePost} = require('../controllers/PostController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
});

const uploads = multer({storage});

router.post('/post', uploads.single('image'), AddPost);
router.get('/userpost', GetPost)
router.delete('/post/:id', DeletePost)
module.exports = router