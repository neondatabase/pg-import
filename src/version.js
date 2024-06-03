import pg from 'pg'
const { Client } = pg

export default async function getPostgresVersion(connectionString) {
  const client = new Client({ connectionString })
  await client.connect()
  const { rows } = await client.query('SHOW server_version')
  const version = rows[0].server_version
  return version.substring(0, version.indexOf('.'))
}
