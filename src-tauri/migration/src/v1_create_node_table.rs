use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Node::Table)
          .if_not_exists()
          .col(
            ColumnDef::new(Node::Id)
              .string()
              .not_null()
              .primary_key()
          )
          .col(ColumnDef::new(Node::PositionX).integer().not_null())
          .col(ColumnDef::new(Node::PositionY).integer().not_null())
          .col(ColumnDef::new(Node::Label).string().null())
          .col(ColumnDef::new(Node::Type).string().null())
          .col(ColumnDef::new(Node::Data).json().null())
          .to_owned()
      ).await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Node::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Node {
  Table,
  Id,
  PositionX,
  PositionY,
  Label,
  Type,
  Data
}