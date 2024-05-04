import express from 'express'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
const __dirname = import.meta.dirname
import { validatePost, validateEdit, validateRemove } from './validator.js'
import {
	editPost,
	Post,
	getStatusCode,
	createPost,
	getPosts,
	removePost,
} from './global-functions.js'

const app = express()

app.use(express.static('client/dist'))
app.use('/images', express.static('images'))
app.use(express.json())

app.get('/api/posts/', async (req, res) => {
	res.json({ code: 0, data: await getPosts() })
})

app.get('/api/posts/:id', async (req, res) => {
	const posts = await getPosts()
	const post = await posts.find((post) => post.id === req.params.id)
	console.log(post)
	if (!post) {
		res.json({ code: 1, error: 'there is no post with such id' })
		return
	}
	res.json({ code: 0, data: post })
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})

app.post('/api/post', async (req, res) => {
	const { error } = validatePost(req.body)
	if (error) {
		res.json({ code: getStatusCode(false), data: error.message })
		return
	}

	req.body.id = uuidv4()
	createPost(new Post(req.body))

	res.json({ code: 0, data: 'Success' })
})

app.patch('/api/edit-post', async (req, res) => {
	const { error } = validateEdit(req.body)
	if (error) {
		res.json({ code: getStatusCode(false), data: error.message })
		return
	}

	const posts = await getPosts()
	const postId = posts.findIndex((post) => post.id === req.body.id)
	if (postId === -1) {
		res.json({
			code: getStatusCode(false),
			data: 'there is no post with such id',
		})
		return
	}

	editPost(postId, await createPost(new Post(req.body)))

	res.json({ code: 0, data: 'Success' })
})

app.delete('/api/remove-post/:id', async (req, res) => {
	const { error } = validateRemove({
		passcode: req.body.passcode,
		id: req.params.id,
	})
	if (error) {
		res.json({ code: getStatusCode(false), data: error.message })
		return
	}

	const posts = await getPosts()
	if (!posts.find((post) => post.id === req.params.id)) {
		res.json({
			code: getStatusCode(false),
			data: 'there is no post with such id',
		})
		return
	}
	removePost(req.params.id)

	res.json({ code: 0, data: 'Success' })
})

app.listen(3000)
