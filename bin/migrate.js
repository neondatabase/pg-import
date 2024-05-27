#!/usr/bin/env node

import { program } from 'commander'
import { migrateData } from '../src/index.js'

program
  .option('--silent <silent>', 'Suppress console output')
  .option('--source <source>', 'Source PostgreSQL connection string')
  .option('--accept-all <accept-all>', 'Automatically accept all prompts')
  .option('--destination <destination>', 'Destination PostgreSQL connection string')

program.parse(process.argv)

const options = program.opts()

process.env.SILENT = options.silent
process.env.ACCEPT_ALL = options.acceptAll
process.env.SOURCE_CONNECTION_STRING = options.source
process.env.DESTINATION_CONNECTION_STRING = options.destination

migrateData()
