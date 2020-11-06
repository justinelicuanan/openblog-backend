const Post = require('../models/Post');

// Create a post
const createPost = async (req, res) => {
	const { title, slug, body } = req.body;
	try {
		const post = await Post.create({
			title,
			slug,
			body,
			userId: req.user._id,
		});
		res.status(201).json({
			success: true,
			message: 'Post created successfully',
		});
	} catch (error) {
		let err = {};
		if (error._message === 'post validation failed') {
			Object.keys(error.errors).forEach((errPath) => {
				err[errPath] = error.errors[errPath].message;
			});
			return res.status(400).json({ err });
		}
		if (error.code === 11000 && error.keyPattern.slug) {
			err.slug = 'Slug is already in used';
			return res.status(400).json({ err });
		}
		res.status(400).json({ err: error });
	}
};

// Get single post
const postGet = (req, res) => {};

// Get all posts
const postsGet = async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (err) {
		res.status(400).json({ err });
	}
};

// Update a post
const updatePatch = (req, res) => {};

// Delete a post
const deleteDelete = async (req, res) => {
	try {
		const post = await Post.deleteOne({ slug: req.params.slug });
		if (!post.n)
			return res.status(400).json({
				err: true,
				message: 'Post does not exist',
			});
		res.json({
			success: true,
			message: 'Post deleted successfully',
		});
	} catch (err) {
		res.status(400).json({ err });
	}
};

module.exports = {
	createPost,
	postGet,
	postsGet,
	updatePatch,
	deleteDelete,
};
