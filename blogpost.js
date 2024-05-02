import express from 'express'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
const __dirname = import.meta.url
import { validatePost, validateEdit, validateRemove } from './validator.js'
console.log(__dirname)
function getStatusCode(boolean = true) {
	if (boolean) return 0
	else return 1
}

const app = express()

app.use(express.static(path.resolve(__dirname, 'client/dist')))
app.use('/images', express.static('images'))
app.use(express.json())

let posts = await fs.readFile('posts.json', 'utf-8')

app.get('/api/posts/', async (req, res) => {
	const data = JSON.parse(posts)
	res.json({ code: 0, data })
})
app.get('/posts/:id', async (req, res) => {
	const data = posts.find((post) => post.id === req.params.id)

	if (!data) {
		res.json({ code: 1, error: 'there is no post with such id' })
		return
	}
	res.json({ code: 0, data })
})

app.post('/post', async (req, res) => {
	const { error } = validatePost(req.body)
	if (error) {
		res.json({ code: getStatusCode(false), message: error.message })
		return
	}
	let postsParse
	if (!posts) {
		postsParse = []
	} else postsParse = JSON.parse(posts)
	delete req.body.passcode
	req.body.id = uuidv4()
	postsParse.push(req.body)
	fs.writeFile('posts.json', JSON.stringify(postsParse))
	res.json({ code: 0, data: 'Success' })
})
app.patch('/edit-post', async (req, res) => {
	const { error } = validateEdit(req.body)
	if (error) {
		res.json({ code: getStatusCode(false), message: error.message })
		return
	}
	let postsParse
	if (!posts) {
		postsParse = []
	} else postsParse = JSON.parse(posts)
	const editPost = postsParse.findIndex((post) => post.id === req.body.id)
	console.log(editPost)
	if (editPost === -1) {
		res.json({
			code: getStatusCode(false),
			data: 'there is no post with such id',
		})
		return
	}
	postsParse[editPost] = req.body
	fs.writeFile('posts.json', JSON.stringify(postsParse))
	res.json({ code: 0, data: 'Success' })
})
app.delete('/api/remove-post/:id', async (req, res) => {
	const { error } = validateRemove({
		passcode: req.body.passcode,
		id: req.params.id,
	})
	if (error) {
		res.json({ code: getStatusCode(false), message: error.message })
		return
	}
	let postsParse
	if (!posts) {
		postsParse = []
	} else postsParse = JSON.parse(posts)

	if (!postsParse.find((post) => post.id === req.params.id)) {
		res.json({
			code: getStatusCode(false),
			data: 'there is no post with such id',
		})
		return
	}
	const filteredposts = await postsParse.filter(
		(post) => post.id !== req.params.id
	)
	fs.writeFile('posts.json', JSON.stringify(filteredposts)).then(() => {
		res.json({ code: 0, data: 'Success' })
	})
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'))
})

app.listen(3000)
