const router = require('express').Router();
const playerModel = require('../../models/player/player');


const {
  createProfile,
  getProfile,
  addRemoveFollow,
  flagProfile,
  deleteProfile,
  updateStatus,
  subscribeMail,
  contactUs,
  getLeads,
  getPlayer,
  getHomeData,
  ratingRequest,
  unversity_find_with_search,
  all_player_location_list,
  player_find_with_location,
  upload_video,
  upload_embedded_video,
  Weaknesses_Strengths,
  scouting,
  emailVerification_contactUs,
  school_list

} = require('../../controllers/profile/profile');
const { authenticate } = require('../../middleware/authentication');
const { multerStorage } = require('../../utils/multer');
router.post(
  '/create-profile',
  authenticate,
  multerStorage.fields([
    { name: 'images', maxCount: 10 },
    { name: 'picture', maxCount: 1 },
    { name: 'videos', maxCount: 4 },
  ]),
  createProfile
);
// router.post(
//   '/createprofile',
//   authenticate,
//   multerStorage.fields([
//     { name: 'images', maxCount: 10 },
//     { name: 'picture', maxCount: 1 },
//     { name: 'videos', maxCount: 4 },
//   ]),
//   createProfileTest
// );
router.post('/update-position', async (req, res) => {
  const { id, position } = req.body;

  if (!id || !position) {
    return res.status(400).json({ message: 'id and position are required' });
  }

  try {
    // Update position
    const result = await playerModel.updateOne(
      { _id: id },
      { $set: { position: position } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No player found or position unchanged' });
    }

    // Fetch the updated document
    const updatedPlayer = await playerModel.findById(id);
    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Player not found after update' });
    }

    // Respond with the updated document
    return res.status(200).json({
      message: 'Player position updated successfully',
      data: {
        id: updatedPlayer._id,
        position: updatedPlayer.position
      }
    });

  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ error: 'Server error. Please retry.' });
  }
});

router.get('/get-profile/:id', getProfile);
router.delete('/delete-profile/:id', deleteProfile);
router.get('/getPlayer', getPlayer);
router.post('/rating-request', ratingRequest);
router.get('/getHomeData', getHomeData);
router.post('/contactUs', contactUs);
router.get('/leads', getLeads);
router.post('/subscribeMail', subscribeMail);
router.get('/flagProfile/:id', authenticate, flagProfile);
router.post('/updateStatus', updateStatus);
router.get('/addRemoveFollow/:id', authenticate, addRemoveFollow);
router.post('/unversity_find_with_search', unversity_find_with_search);
router.post('/all_player_location_list', all_player_location_list)
router.post('/player_find_with_location', player_find_with_location)
router.post('/Weaknesses_Strengths', Weaknesses_Strengths)
router.post('/scouting', scouting)
router.get('/emailVerification_contactUs/:id', emailVerification_contactUs)

// university list
router.post('/university_list', school_list)


router.post(
  '/upload_video',
  authenticate,
  multerStorage.single("videos"),
  upload_video
);

router.post(
  '/upload_embedded_video',
  authenticate,
  multerStorage.single("videos"),
  upload_embedded_video
);



module.exports = router;
