use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
          Table::create()
              .table(Edge::Table)
              .if_not_exists()
              .col(
                ColumnDef::new(Edge::Id)
                  .string()
                  .not_null()
                  .primary_key(),
              )
              .col(ColumnDef::new(Edge::Source).string().not_null())
              .col(ColumnDef::new(Edge::Target).string().not_null())
              .col(ColumnDef::new(Edge::Label).string().default("").not_null())
              .col(ColumnDef::new(Edge::Type).string().not_null())
              .foreign_key(
                ForeignKey::create()
                  .from(Edge::Table, Edge::Source)
                  .to(Node::Table, Node::Id)
                  .on_delete(ForeignKeyAction::Cascade)
                  .on_update(ForeignKeyAction::Cascade),
              )
              .foreign_key(
                ForeignKey::create()
                  .from(Edge::Table, Edge::Target)
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
      .drop_table(Table::drop().table(Edge::Table).to_owned())
      .await
  }
}

#[derive(DeriveIden)]
enum Edge {
  Table,
  Id,
  Source,
  Target,
  Label,
  Type
}

#[derive(DeriveIden)]
enum Node {
  Table,
  Id,
}