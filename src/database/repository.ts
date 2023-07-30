import { denormalizeObject, normalize } from '@/shared/core/data'
import DatabaseController from '@database/controller'

type ParsedCharacter = Pick<CharacterWithId, 'name' | 'id' | 'tag' | 'cost'> & {
  positions: string
  leaderTraits: string
  commanderTraits: string
  ministerTraits: string
  officerTraits: string
  roles: string
}

export default class CharacterRepository {
  static instance: CharacterRepository | null = null
  database = DatabaseController.getInstance()

  private constructor() {}

  static getInstance() {
    if (!this.instance) this.instance = new CharacterRepository()
    return this.instance
  }

  async findAll(): Promise<CharacterWithId[]> {
    const raw = await this.database.findAll<ParsedCharacter>('SELECT * FROM characters')
    return raw.map((e) =>
      denormalizeObject<ParsedCharacter, CharacterWithId>(e, [
        'positions',
        'leaderTraits',
        'commanderTraits',
        'ministerTraits',
        'officerTraits',
        'roles'
      ])
    )
  }

  async findOne(id: string): Promise<CharacterWithId[]> {
    return await this.database.findOne('SELECT * FROM characters WHERE id = $1', [id])
  }

  async create(character: CharacterWithId) {
    const positions = normalize(character.positions)
    const leaderTraits = normalize(character.leaderTraits)
    const commanderTraits = normalize(character.commanderTraits)
    const ministerTraits = normalize(character.ministerTraits)
    const officerTraits = normalize(character.officerTraits)
    const roles = normalize(character.roles)
    const { id, name, tag, ideology, cost } = character

    return await this.database.execute(
      `INSERT INTO characters (id, name, tag, ideology, positions, leaderTraits, commanderTraits, ministerTraits, officerTraits, roles, cost) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        name,
        tag,
        ideology,
        positions,
        leaderTraits,
        commanderTraits,
        ministerTraits,
        officerTraits,
        roles,
        cost
      ]
    )
  }

  async update(character: CharacterWithId) {
    const { id, ...others } = character
    const data = normalize(others)

    return await this.database.execute(
      `
      UPDATE characters SET name = $1, tag = $2, ideology = $3, 
        positions = $4, leaderTraits = $5, commanderTraits = $6, ministerTraits = $7, officerTraits = $8
        roles = $9, cost = $10, 
      WHERE id = $11
      `,
      [...data, id]
    )
  }

  async remove(character: CharacterWithId) {
    return await this.database.execute(`DELETE FROM characters WHERE id = $1`, [character.id])
  }
}
