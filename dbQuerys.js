export default {
	getPostsQuery: `SELECT * FROM ${process.env.POSTGRESTABLE}`,
	createPostQuery: `INSERT INTO ${process.env.POSTGRESTABLE} (title, text, tags, image) VALUES($1,$2,$3,$4)`,
	removePostQuery: `DELETE FROM ${process.env.POSTGRESTABLE} WHERE ${process.env.POSTGRESTABLE}.id = $1`,
	editPostQuery: `UPDATE ${process.env.POSTGRESTABLE} SET title = $1, text = $2, tags = $3, image = $4 WHERE id = $5`,
}
