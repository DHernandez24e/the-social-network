const router = require('express').Router()
const {
    getThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../controllers/thought-controller');
const { route } = require('./user-routes');

// /api/thoughts
router
    .route('/thoughts')
    .get(getThoughts)
    .post(addThought)

// /api/thoughts/:id
router
    .route('/thoughts/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

// /api/thoughts/:thoughtId/reactions
router
    .route('/thoughts/:thoughtId/reactions')
    .post(addReaction)
    .delete(removeReaction)

module.exports = router