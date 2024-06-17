import pg from 'pg'
import 'dotenv/config'
import { configDotenv } from 'dotenv'
configDotenv()
const Pool = pg.Pool
const pool = new Pool({
	user: process.env.POSTGRESUSER,
	password: process.env.POSTGRESPASSWORD,
	host: process.env.POSTGRESHOST,
	port: process.env.POSTGRESPORT,
	database: process.env.POSTGRESDATABASE,
})
export { pool }
