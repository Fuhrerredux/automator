use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Characters::Table)
          .if_not_exists()
          .col(
            ColumnDef::new(Characters::Id)
              .string()
              .not_null()
              .primary_key()
          )
          .col(ColumnDef::new(Characters::Name).string().not_null())
          .col(ColumnDef::new(Characters::Tag).string().not_null())
          .col(ColumnDef::new(Characters::Ideology).string())
          .col(ColumnDef::new(Characters::Positions).string())
          .col(ColumnDef::new(Characters::LeaderTraits).string())
          .col(ColumnDef::new(Characters::LeaderIdeologies).string())
          .col(ColumnDef::new(Characters::CommanderTraits).string())
          .col(ColumnDef::new(Characters::MinisterTraits).string())
          .col(ColumnDef::new(Characters::OfficerTraits).string())
          .col(ColumnDef::new(Characters::Roles).string())
          .col(ColumnDef::new(Characters::Cost).integer())
          .to_owned()
      ).await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Characters::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Characters {
  Table,
  Id,
  Name,
  Tag,
  Ideology,
  Positions,
  LeaderTraits,
  LeaderIdeologies,
  CommanderTraits,
  MinisterTraits,
  OfficerTraits,
  Roles,
  Cost,
}