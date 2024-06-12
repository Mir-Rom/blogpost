import pg from 'pg'
const Pool = pg.Pool
const pool = new Pool({
	user: 'postgres',
	password: '99353',
	host: 'localhost',
	port: process.env.POSTGRESPASSWORD,
	database: 'posts',
})
export { pool }
