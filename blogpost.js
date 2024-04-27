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
	delete req.body.passcode
	const reqBodyKeys = Object.keys(req.body)
	console.log(reqBodyKeys)
	if (reqBodyKeys.length > 5) {
		res.json({ code: 1, error: 'too many properties' })
		return
	}

	if (reqBodyKeys.length < 2) {
		res.json({ code: 1, error: 'too little properties' })
		return
	}
	const necessaryValidPostKeys = ['title', 'text']
	if (!reqBodyKeys.every((i) => necessaryValidPostKeys.includes(i))) {
		res.json({ code: 1, error: 'invalid properties' })
		return
	}
	if (reqBodyKeys.length === 4) {
		const validPostKeys = ['tags', 'image']
		if (!reqBodyKeys.some((i) => validPostKeys.includes(i))) {
			res.json({ code: 1, error: 'invalid properties' })
			return
		}
	}
	if (reqBodyKeys.length === 5) {
		const validPostKeys = ['tags', 'image']
		if (reqBodyKeys.every((i) => validPostKeys.includes(i))) {
			res.json({ code: 1, error: 'invalid properties' })
			return
		}
	}
	if (reqBodyKeys.length <= 5 && reqBodyKeys.length >= 4) {
		if (!(req.body.tags || req.body.image)) {
			res.json({ code: 1, error: 'invalid image or tags value' })
			return
		}
	}
	if (!req.body) {
		res.json({ code: 1, error: 'data is not json' })
		return
	}
	if (!req.body.title) {
		res.json({ code: 1, error: 'invalid title' })
		return
	}
	if (!req.body.text) {
		res.json({ code: 1, error: 'invalid text' })
		return
	}
	let posts = await fs.readFile('posts.json', 'utf-8')
	if (!posts) {
		posts = []
	} else posts = JSON.parse(posts)

	req.body.id = uuidv4()
	posts.push(req.body)

	fs.writeFile('posts.json', JSON.stringify(posts))
	res.json({ code: 0, data: 'Success' })
})

app.listen(3000)
