use ::entity::{ 
  character, 
  focus, 
  node, 
  connection, 
  character::Entity as Character, 
  focus::Entity as Focus, 
  node::Entity as Node, 
  connection::Entity as Connection};
use sea_orm::*;

pub struct Query;

impl Query {

  // character-related

  pub async fn find_character_by_id(
    db: &DbConn, id: String
  ) -> Result<Option<character::Model>, DbErr> {
    Character::find_by_id(id).one(db).await
  }

  pub async fn find_characters(
    db: &DbConn,
  ) -> Result<Vec<character::Model>, DbErr> {
    let fetcher = Character::find().order_by_asc(character::Column::Id).all(db);
    fetcher.await
  }

   /// If ok, returns (post models, num pages).
  pub async fn find_characters_in_page(
    db: &DbConn,
    page: u64,
    chars_per_page: u64,
  ) -> Result<(Vec<character::Model>, u64), DbErr> {
    // Setup paginator
    let paginator = Character::find()
      .order_by_asc(character::Column::Id)
      .paginate(db, chars_per_page);
    let num_pages = paginator.num_pages().await?;

      // Fetch paginated posts
      paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
  }

  // focus-related

  pub async fn find_focus_by_id(
    db: &DbConn, id: String
  ) -> Result<Option<focus::Model>, DbErr> {
    Focus::find_by_id(id).one(db).await
  }

  pub async fn find_focuses(
    db: &DbConn,
  ) -> Result<Vec<focus::Model>, DbErr> {
    let fetcher = Focus::find().order_by_asc(focus::Column::Id).all(db);
    fetcher.await
  }

  /// If ok, returns (post models, num pages).
  pub async fn find_focuses_in_page(
    db: &DbConn,
    page: u64,
    focuses_per_page: u64,
  ) -> Result<(Vec<focus::Model>, u64), DbErr> {
    // Setup paginator
    let paginator = Focus::find()
      .order_by_asc(focus::Column::Id)
      .paginate(db, focuses_per_page);
    let num_pages = paginator.num_pages().await?;

      // Fetch paginated posts
      paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
  }

  // nodes

  pub async fn find_node_by_id(
    db: &DbConn, id: String
  ) -> Result<Option<node::Model>, DbErr> {
    Node::find_by_id(id).one(db).await
  }

  
  pub async fn find_nodes(
    db: &DbConn,
  ) -> Result<Vec<node::Model>, DbErr> {
    let fetcher = Node::find().order_by_asc(node::Column::Id).all(db);
    fetcher.await
  }

  /// If ok, returns (post models, num pages).
  pub async fn find_nodes_in_page(
    db: &DbConn,
    page: u64,
    nodes_per_page: u64,
  ) -> Result<(Vec<node::Model>, u64), DbErr> {
    // Setup paginator
    let paginator = Node::find()
      .order_by_asc(node::Column::Id)
      .paginate(db, nodes_per_page);
    let num_pages = paginator.num_pages().await?;

      // Fetch paginated posts
      paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
  }

  // connections

  pub async fn find_connections(
    db: &DbConn,
  ) -> Result<Vec<connection::Model>, DbErr> {
    let fetcher = Connection::find().order_by_asc(connection::Column::Id).all(db);
    fetcher.await
  }

  pub async fn find_connections_by_source(
    db: &DbConn, 
    source_id: &str
  ) -> Result<Vec<connection::Model>, DbErr> {
    Connection::find()
      .filter(connection::Column::Source.eq(source_id))
      .all(db)
      .await
  }

  pub async fn find_connections_by_target(
    db: &DbConn, 
    target_id: &str
  ) -> Result<Vec<connection::Model>, DbErr> {
    Connection::find()
      .filter(connection::Column::Target.eq(target_id))
      .all(db)
      .await
  }

}