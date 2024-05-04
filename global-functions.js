import fs from 'fs/promises'
export function getStatusCode(boolean = true) {
	if (boolean) return 0
	else return 1
}

export async function getPosts() {
	let posts = await fs.readFile('posts.json', 'utf-8')
	if (!posts) {
		posts = []
	} else posts = JSON.parse(posts)
	return posts
}

export class Post {
	constructor(post) {
		this.title = post.title
		this.text = post.text
		this.tags = post.tags
		this.image = post.image
		this.id = post.id
	}
}

export async function createPost(post) {
	const posts = await getPosts()
	console.log(posts)
	posts.push(post)
	fs.writeFile('posts.json', JSON.stringify(posts))
}
export async function removePost(postId) {
	const posts = await getPosts()
	const filteredposts = await posts.filter((post) => post.id !== postId)
	fs.writeFile('posts.json', JSON.stringify(filteredposts))
}
export async function editPost(postId, newPost) {
	const posts = await getPosts()
	posts[postId] = newPost
	fs.writeFile('posts.json', newPost)
}
