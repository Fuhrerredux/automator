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
          .col(ColumnDef::new(Node::Type).string().not_null())
          .col(ColumnDef::new(Node::Label).string().not_null())
          .col(ColumnDef::new(Node::Position).json().not_null())
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
  Type,
  Label,
  Position
}