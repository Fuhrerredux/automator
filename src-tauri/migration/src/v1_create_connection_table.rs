use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
          Table::create()
              .table(Connection::Table)
              .if_not_exists()
              .col(
                  ColumnDef::new(Connection::Id)
                      .string()
                      .not_null()
                      .primary_key(),
              )
              .col(ColumnDef::new(Connection::Source).string().not_null()) // Source node ID
              .col(ColumnDef::new(Connection::Target).string().not_null()) // Target node ID
              .col(ColumnDef::new(Connection::SourceHandle).string().null())
              .col(ColumnDef::new(Connection::TargetHandle).string().null())
              .foreign_key(
                ForeignKey::create()
                  .from(Connection::Table, Connection::Source)
                  .to(Node::Table, Node::Id)
                  .on_delete(ForeignKeyAction::Cascade)
                  .on_update(ForeignKeyAction::Cascade),
              )
              .foreign_key(
                ForeignKey::create()
                  .from(Connection::Table, Connection::Target)
                  .to(Node::Table, Node::Id)
                  .on_delete(ForeignKeyAction::Cascade)
                  .on_update(ForeignKeyAction::Cascade),
              )
              .to_owned(),
      )
      .await
  }

  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Connection::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Connection {
  Table,
  Id,
  Source,
  Target,
  SourceHandle,
  TargetHandle
}

#[derive(DeriveIden)]
enum Node {
  Table,
  Id,
}