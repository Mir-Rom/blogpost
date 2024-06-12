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

const __dirname = import.meta.dirname
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
		const response = getPost(req.params.id)
		const post = new Post(response)
		res.json(createResponse(post))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.post(requests.publishPost, upload.single('image'), async (req, res) => {
	try {
		req.body.tags = JSON.parse(req.body.tags)
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

app.patch(requests.editPost, async (req, res) => {
	try {
		const { error } = validateEdit(req.body)
		if (error) {
			res.json(createResponse(error.message, ERROR_CODE))
			return
		}

		const postId = req.body.id
		postsController.editPost(postId, req.body)

		res.json(createResponse(SUCCESS_MESSAGE))
	} catch {
		res.json(createResponse(errorMessages.internalError, ERROR_CODE))
	}
})

app.delete(requests.removePost, async (req, res) => {
	try {
		const { error } = validateRemove({
			passcode: req.body.passcode,
			id: req.params.id,
		})
		if (error) {
			res.json(createResponse(error.message, ERROR_CODE))
			return
		}

		const postId = req.params.id
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
