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
          .col(ColumnDef::new(Character::LeaderRoles).string())
          .col(ColumnDef::new(Character::AdvisorRoles).string())
          .col(ColumnDef::new(Character::CommanderRoles).string())
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
  LeaderRoles,
  AdvisorRoles,
  CommanderRoles,
  Roles,
}