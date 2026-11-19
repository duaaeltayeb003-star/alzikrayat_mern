// Mounted at /api/photos/:id/comments, so mergeParams exposes :id
const router = require('express').Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const requireUser = require('../middleware/requireUser');
const { validate, commentSchema } = require('../middleware/validation');

router.get('/', commentController.getForPhoto);
router.post('/', requireUser, validate(commentSchema), commentController.create);

module.exports = router;
