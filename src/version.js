import { neon } from '@neondatabase/serverless'

export default async function getPostgresVersion(connectionString) {
  const sql = neon(connectionString)
  const rows = await sql`SHOW server_version`
  const version = rows[0].server_version
  return version.substring(0, version.indexOf('.'))
}
