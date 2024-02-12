use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Character::Table)
          .if_not_exists()
          .col(
            ColumnDef::new(Character::Id)
              .string()
              .not_null()
              .primary_key()
          )
          .col(ColumnDef::new(Character::Name).string().not_null())
          .col(ColumnDef::new(Character::Tag).string().not_null())
          .col(ColumnDef::new(Character::Ideology).string())
          .col(ColumnDef::new(Character::Positions).string())
          .col(ColumnDef::new(Character::LeaderTraits).string())
          .col(ColumnDef::new(Character::LeaderIdeologies).string())
          .col(ColumnDef::new(Character::CommanderTraits).string())
          .col(ColumnDef::new(Character::AdvisorTraits).string())
          .col(ColumnDef::new(Character::Roles).string())
          .to_owned()
      ).await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Character::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Character {
  Table,
  Id,
  Name,
  Tag,
  Ideology,
  Positions,
  LeaderTraits,
  LeaderIdeologies,
  CommanderTraits,
  AdvisorTraits,
  Roles,
}