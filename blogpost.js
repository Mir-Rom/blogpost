import express from 'express'
import fs from 'fs/promises'
const app = express()

app.get('/posts/', async (req, res) => {
	const posts = JSON.parse(await fs.readFile('posts.json', 'utf8'))
	res.json({ code: 0, posts })
})
app.get('/posts/:id', async (req, res) => {
	const posts = JSON.parse(await fs.readFile('posts.json', 'utf-8'))
	for (const post of posts) {
		if (post.id == req.params.id) {
			res.json({ code: 0, post })
		}
	}
})

app.listen(3000)
