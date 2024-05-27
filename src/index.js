import { v4 as uuidv4 } from 'uuid'
import askUserConfirmation from './utils.js'
import getPostgresVersion from './version.js'
import executeCommandSync from './subcommand.js'

async function setupPgDumpAndPgRestore(postgresVersion) {
  const acceptAll = process.env.ACCEPT_ALL === 'true'
  const os = executeCommandSync('uname', ['-s'], { silent: true }).stdout.toString().trim()
  let installOutput = ''
  if (os === 'Darwin') {
    if (executeCommandSync('which', ['brew'], { silent: true }).stdout.length < 1) {
      if (!acceptAll) {
        const confirmation = await askUserConfirmation('Homebrew is not installed. Would you like to install it? (Y/n) ')
        if (!confirmation) {
          if (process.env.SILENT !== 'false') {
            console.log('Homebrew installation aborted.')
          }
        } else executeCommandSync('/bin/bash', ['-c', '"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'])
      } else executeCommandSync('/bin/bash', ['-c', '"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'])
    }
    if (!acceptAll) {
      const confirmation = await askUserConfirmation(`Install PostgreSQL ${postgresVersion} using Homebrew? (Y/n) `)
      if (!confirmation) {
        throw new Error('PostgreSQL installation aborted.')
      }
    }
    installOutput += executeCommandSync('brew', ['install', `postgresql@${postgresVersion}`]).stdout.toString()
    installOutput += executeCommandSync('brew', ['link', `postgresql@${postgresVersion}`, '--force']).stdout.toString()
  } else if (os === 'Linux') {
    if (!acceptAll) {
      const confirmation = await askUserConfirmation('Install necessary packages and PostgreSQL on Linux? (Y/n) ')
      if (!confirmation) {
        throw new Error('PostgreSQL installation aborted.')
      }
    }
    executeCommandSync('sudo', ['apt-get', 'install', '-y', 'curl', 'wget', 'ca-certificates'], { silent: true })
    executeCommandSync('sudo', ['sh', '-c', `echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list`])
    executeCommandSync('/bin/bash', [
      '-c',
      `wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /usr/share/keyrings/postgresql-archive-keyring.gpg > /dev/null`,
    ])
    const debCommand = `echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] https://apt.postgresql.org/pub/repos/apt jammy-pgdg main"`
    const sudoTeeCommand = 'sudo tee /etc/apt/sources.list.d/pgdg.list > /dev/null'
    const command = `${debCommand} | ${sudoTeeCommand}`
    executeCommandSync('/bin/bash', ['-c', command])
    executeCommandSync('sudo', ['apt-get', 'update'], { silent: true })
    executeCommandSync('sudo', ['apt-get', '-y', 'install', `postgresql-${postgresVersion}`])
    installOutput += `If you need to have this software first in your PATH instead consider running:\n"/usr/lib/postgresql/${postgresVersion}/bin:$PATH"`
  } else throw new Error('Unsupported OS.')
  if (installOutput.length > 0) {
    installOutput = installOutput.split('\n')
    const index = installOutput.indexOf('If you need to have this software first in your PATH instead consider running:')
    const tmp = installOutput[index + 1].trim()
    if (tmp?.includes('PATH')) process.env.PATH = `${tmp.substring(tmp.indexOf('"') + 1, tmp.lastIndexOf('"'))}`
  }
}

async function dueDiligence() {
  const [sourcePostgresVersion, destinationPostgresVersion] = await Promise.all([
    getPostgresVersion(process.env.SOURCE_CONNECTION_STRING),
    getPostgresVersion(process.env.DESTINATION_CONNECTION_STRING),
  ])
  if (destinationPostgresVersion !== sourcePostgresVersion) {
    throw new Error(`source postgres version: ${sourcePostgresVersion} does not match the destination postgres version: ${destinationPostgresVersion}.`)
  }
  return sourcePostgresVersion
}

export async function migrateData() {
  const postgresVersion = await dueDiligence()
  await setupPgDumpAndPgRestore(postgresVersion)
  console.log('---\nStarting migration\n---')
  const dumpName = `dump_restore_${uuidv4()}.bak`
  executeCommandSync('pg_dump', ['-Fc', '-v', '-d', process.env.SOURCE_CONNECTION_STRING, '-f', dumpName])
  executeCommandSync('pg_restore', ['-v', '-d', process.env.DESTINATION_CONNECTION_STRING, dumpName])
  console.log('---\nMigration completed successfully.\n---')
  process.exit(0)
}
