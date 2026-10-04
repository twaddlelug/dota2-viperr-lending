import { loadEnv } from './load-env.ts'

loadEnv()

const isTypegen = process.argv.includes('typegen')

export const isDbBuild = process.env.DATA_SOURCE === 'db' || isTypegen
