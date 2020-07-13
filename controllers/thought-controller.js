const { Thought, User } = require('../models');
const { populate } = require('../models/User');

const thoughtController = {
    //Get all thoughts
    getThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err));
    },
    //Get single thought by id
    getThoughtById({ params}, res) {
        Thought.findOne({ _id: params.id })
            .populate(
                {
                    path: 'reactions',
                    select: '-__v'
                }
            )
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' })
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },
    //Add thought
    addThought({ params , body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err));
    },
    //Update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!' })
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err))
    },
    //Delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id!' })
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },
    //Add reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought data found with this id!' });
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },
    // Remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reaction: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!' })
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController