const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const {
  userById,
  read,
  update,
  likeProject,
  addComment,
  backProject
} = require('../controllers/user');



router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get('/user/:userId',  read);
router.put('/user/:userId',  update);
router.put('/:userId/like/:projectId', likeProject);
router.post('/:projectId/comment', addComment);

router.put('/:userId/back/:projectId', backProject);
router.param('userId', userById);

module.exports = router;