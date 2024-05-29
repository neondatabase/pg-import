import { spawnSync } from 'child_process'

export default function executeCommandSync(command, args, options) {
  const result = spawnSync(command, args, { ...options, stdio: 'pipe' })
  const stdout = result.stdout?.toString() ?? ''
  const stderr = result.stderr?.toString() ?? ''
  if (result.status !== 0) {
    console.error(`Command '${command}' failed with code ${result.status}`)
    console.error(stderr)
  }
  const displayLog = process.env.SILENT !== 'true' && !Boolean(options?.silent)
  if (displayLog) {
    console.log(stdout)
    console.error(stderr)
  }
  return { stdout, stderr }
}
