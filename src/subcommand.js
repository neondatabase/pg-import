import { spawnSync } from 'child_process'

export default function executeCommandSync(command, args, options) {
  const result = spawnSync(command, args, { ...options, stdio: ['pipe', 'pipe', 'inherit'] })
  const stdout = result.stdout ? result.stdout.toString() : ''
  const stderr = result.stderr ? result.stderr.toString() : ''
  if (result.status !== 0) {
    console.error(`Command '${command}' failed with code ${result.status}`)
    console.error(stderr)
  }
  if (process.env.SILENT !== 'true') {
    if (!Boolean(options?.silent)) {
      console.log(stdout)
      console.error(stderr)
    }
  }
  return { stdout, stderr }
}
