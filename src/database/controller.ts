import Database, { QueryResult } from 'tauri-plugin-sql-api'

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  ideology TEXT,
  positions TEXT,
  leaderTraits TEXT,
  leaderIdeologies TEXT,
  commanderTraits TEXT,
  ministerTraits TEXT,
  officerTraits TEXT,
  roles TEXT,
  cost INTEGER
)`

export default class DatabaseController {
  static controller: DatabaseController | null = null
  instance: Database | null = null

  private constructor() {}

  static getInstance() {
    if (!this.controller) this.controller = new DatabaseController()
    return this.controller
  }

  async init() {
    const name = 'automator'
    this.instance = await Database.load(`sqlite:${name}.db`)

    await this.instance.execute(CREATE_TABLE)
  }

  async close() {
    return await this.instance?.close()
  }

  async findAll<T>(query: string): Promise<T[]> {
    if (!this.instance) throw Error('Database is not yet initialized')
    return await this.instance.select(query)
  }

  async findOne<T, E>(query: string, bind: E[]): Promise<T[]> {
    if (!this.instance) throw Error('Database is not yet initialized')
    return await this.instance.select(query, bind)
  }

  async execute<E>(query: string, bind: E[]): Promise<QueryResult> {
    if (!this.instance) throw Error('Database is not yet initialized')
    return await this.instance.execute(query, bind)
  }
}
