import express from 'express'
import fs from 'fs/promises'
const app = express()
app.use('/images', express.static('images'))

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

app.listen(3000)
