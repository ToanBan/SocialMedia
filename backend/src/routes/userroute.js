const express = require('express');
const router = express.Router();
const { UserRegister } = require('../controllers/UserController'); 
const {UserLogin} = require('../controllers/UserController')
const {UserLogout} = require('../controllers/UserController')
const {GetUser} = require('../controllers/UserController')
const {RefreshToken} = require('../controllers/UserController')
const {EditProfile} = require('../controllers/UserController')
const {GetInfoProfile} = require('../controllers/UserController')
const {SearchProfile} = require('../controllers/UserController')
const {ProfileDetail} = require('../controllers/UserController')
const {UserFollowing} = require('../controllers/UserController')
const {PostFollowing} = require('../controllers/UserController')
const {UserLikePost} = require('../controllers/UserController')
const {UserChatFollowing} = require('../controllers/UserController')
const {UserChatFollowingDetail} = require('../controllers/UserController')
const AuthMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
});

const uploads = multer({storage});


router.post('/register', UserRegister);
router.post('/login', UserLogin);
router.post('/logout', UserLogout);
router.get('/getuser', AuthMiddleware, GetUser)
router.get('/refreshtoken', RefreshToken);
router.post('/edit', uploads.single('image'), EditProfile);
router.get('/infouser', GetInfoProfile);
router.post('/search', SearchProfile);
router.get('/profile/:id', ProfileDetail);
router.post('/following', UserFollowing);
router.get('/homepost', PostFollowing);
router.post('/like', UserLikePost);
router.get('/chatfollowing', UserChatFollowing);
router.post('/chatfollowingdetail/:id', UserChatFollowingDetail);
module.exports = router;
