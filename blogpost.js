import express from 'express'
import path from 'path'

import { validatePost, validateEdit, validateRemove } from './validator.js'
import postsController from './postsController.js'
import { createResponse } from './utils.js'
import Post from './Post.js'
import requests from './requestUrls.js'
import errorMessages from './errorMessages.js'
import { SUCCESS_MESSAGE, ERROR_CODE } from './constants.js'
import paths from './paths.js'
import multer from 'multer'
const storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
	destination: function (req, file, cb) {
		cb(null, 'images/')
	},
})

const upload = multer({ dest: 'images/', storage })

const app = express()

app.use(express.static(path.resolve(paths.clientBuildDirectory)))
app.use(requests.images, express.static(paths.imagesDirectory))
app.use(express.json())

app.get(requests.getPosts, async (req, res) => {
	try {
		const posts = await postsController.getPosts()
		res.json(createResponse(posts))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.get(requests.getPost, async (req, res) => {
	try {
		const response = postsController.getPost(req.params.id)
		const post = new Post(await response)
		res.json(createResponse(post))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.post(requests.publishPost, upload.single('image'), async (req, res) => {
	try {
		const { error } = validatePost({ ...req.body, image: req.file.filename })
		if (error) {
			res.json(createResponse(error.message, ERROR_CODE))
			return
		}

		const newPost = new Post({ ...req.body, image: req.file.filename })
		postsController.createPost(newPost)

		res.json(createResponse(SUCCESS_MESSAGE))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.patch(requests.editPost, upload.single('image'), async (req, res) => {
	try {
		try {
			await validateEdit({
				...req.body,
				image: req.file.filename,
			})
		} catch {
			res.json(createResponse(errorMessages.validationError, ERROR_CODE))
		}

		postsController.editPost({ ...req.body, image: req.file.filename })

		res.json(createResponse(SUCCESS_MESSAGE))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.delete(requests.removePost, async (req, res) => {
	try {
		const postId = req.params.id
		try {
			await validateRemove({
				passcode: req.body.passcode,
				id: postId,
			})
		} catch {
			res.json(createResponse(errorMessages.validationError, ERROR_CODE))
		}
		postsController.removePost(postId)

		res.json(createResponse(SUCCESS_MESSAGE))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(paths.clientBuildDirectory, paths.clientIndexFile))
})

app.listen(3000)
