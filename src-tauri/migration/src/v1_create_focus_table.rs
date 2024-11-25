use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Focus::Table)
          .if_not_exists()
          .col(
            ColumnDef::new(Focus::Id)
              .string()
              .not_null()
              .primary_key()
          )
          .col(ColumnDef::new(Focus::Name).string().not_null())
          .col(ColumnDef::new(Focus::Tag).string().not_null())
          .col(ColumnDef::new(Focus::PositionX).integer())
          .col(ColumnDef::new(Focus::PositionY).integer())
          .col(ColumnDef::new(Focus::Relatives).string())
          .col(ColumnDef::new(Focus::Prerequisites).string())
          .col(ColumnDef::new(Focus::Exclusives).string())
          .col(ColumnDef::new(Focus::Cost).integer())
          .to_owned()
      ).await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Focus::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Focus {
  Table,
  Id,
  Tag,
  Name,
  PositionX,
  PositionY,
  Relatives,
  Prerequisites,
  Exclusives,
  Cost
}