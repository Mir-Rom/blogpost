import express from 'express'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
const app = express()
app.use('/images', express.static('images'))
app.use(express.json())
app.get('/posts/', async (req, res) => {
	const data = JSON.parse(await fs.readFile('posts.json', 'utf8'))
	res.json({ code: 0, data })
})
app.get('/posts/:id', async (req, res) => {
	const posts = JSON.parse(await fs.readFile('posts.json', 'utf-8'))
	const data = posts.find((post) => post.id === req.params.id)

	if (!data) {
		res.json({ code: 1, error: 'not found' })
		return
	}
	res.json({ code: 0, data })
})
app.post('/post', async (req, res) => {
	if (
		req.body.passcode !==
		'7890b64eedcf03848d6f427d11fb177ca470927320b6d83c8beba0a626d0b399'
	) {
		res.json({ code: 1, error: 'wrong passcode' })
		return
	}
	if (!req.body) {
		res.json({ code: 1, error: 'data is not json' })
	}

	let posts = await fs.readFile('posts.json', 'utf-8')
	if (!posts) {
		posts = []
	} else posts = JSON.parse(posts)

	req.body.id = uuidv4()
	delete req.body.passcode
	posts.push(req.body)

	fs.writeFile('posts.json', JSON.stringify(posts))
	res.json({ code: 0, data: 'Success' })
})

app.listen(3000)
