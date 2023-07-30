import { normalize } from '@/shared/core/data'
import DatabaseController from '@database/controller'

export default class CharacterRepository {
  static instance: CharacterRepository | null = null
  database = DatabaseController.getInstance()

  private constructor() {}

  static getInstance() {
    if (!this.instance) this.instance = new CharacterRepository()
    return this.instance
  }

  async findAll(): Promise<CharacterWithId[]> {
    return await this.database.findAll('SELECT * FROM characters')
  }

  async findOne(id: string): Promise<CharacterWithId[]> {
    return await this.database.findOne('SELECT * FROM characters WHERE id = $1', [id])
  }

  async create(character: CharacterWithId) {
    const data = normalize(character)

    return await this.database.execute(
      'INSERT INTO characters VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      data
    )
  }

  async update(character: CharacterWithId) {
    const { id, ...others } = character
    const data = normalize(others)

    return await this.database.execute(
      `
      UPDATE characters SET 
      name = $1, 
      tag = $2, 
      ideology = $3, 
      positions = $4, 
      leaderTraits = $5, 
      commanderTraits = $6, 
      ministerTraits = $7, 
      roles = $8, 
      cost = $9, 
      WHERE id = $10
      `,
      [...data, id]
    )
  }

  async remove(character: CharacterWithId) {
    return await this.database.execute(`DELETE FROM characters WHERE id = $1`, [character.id])
  }
}
