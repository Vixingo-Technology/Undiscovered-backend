const router = require('express').Router();
const {
  createNewsFeed,
  getPlayers,
  editNewsFeed,
  getSingleNewsFeed,
  getNewsFeed,
  getAllNewsFeed,
  deleteNewsFeed,
} = require('../../controllers/news feed/newsFeed');
const { multerStorage } = require('../../utils/multer');
// router.post('/editNewsFeed', multerStorage.single('banner'), editNewsFeed);
// router.post('/create-newsFeed', multerStorage.single('banner'), createNewsFeed);

router.post(
  '/editNewsFeed',
  multerStorage.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'image_of_author', maxCount: 1 },
  ]),
  editNewsFeed
);

router.post(
  '/create-newsFeed',
  multerStorage.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'image_of_author', maxCount: 1 },
  ]),
  createNewsFeed
);

router.get('/getSingleNewsFeed/:id', getSingleNewsFeed);
router.get('/getNewsFeed', getNewsFeed);
router.get('/news-feed', getAllNewsFeed);
router.delete('/delete-news/:id', deleteNewsFeed);
router.get('/getPlayers', getPlayers);

module.exports = router;