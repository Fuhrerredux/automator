use ::entity::{characters, characters::Entity as Character};
use sea_orm::*;

pub struct Query;

impl Query {
  pub async fn find_character_by_id(db: &DbConn, id: String) -> Result<Option<characters::Model>, DbErr> {
    Character::find_by_id(id).one(db).await
  }

   /// If ok, returns (post models, num pages).
   pub async fn find_characters_in_page(
    db: &DbConn,
    page: u64,
    chars_per_page: u64,
) -> Result<(Vec<characters::Model>, u64), DbErr> {
    // Setup paginator
    let paginator = Character::find()
      .order_by_asc(characters::Column::Id)
      .paginate(db, chars_per_page);
    let num_pages = paginator.num_pages().await?;

    // Fetch paginated posts
    paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
  }
}