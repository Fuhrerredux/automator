mod prepare;

use service::{Mutation,Query};
use entity::characters;
use prepare::prepare_mock_db;

#[tokio::test]
async fn main() {
  let db = &prepare_mock_db();

  {
    let char = Query::find_character_by_id(db, "XXX".to_owned()).await.unwrap().unwrap();
    assert_eq!(char.id, "XXX".to_owned());
  }
}