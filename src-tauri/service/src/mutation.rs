use ::entity::{character, character::Entity as Character};
use sea_orm::*;

pub struct Mutation;

impl Mutation {
  pub async fn create_character(
    db: &DbConn,
    form_data: character::Model,
  ) -> Result<character::Model, DbErr> {
    character::ActiveModel {
      id: Set(form_data.id.to_owned()),
      name: Set(form_data.name.to_owned()),
      tag: Set(form_data.tag.to_owned()),
      ideology: Set(form_data.ideology.to_owned()),
      leader_roles: Set(form_data.leader_roles.to_owned()),
      commander_traits: Set(form_data.commander_traits.to_owned()),
      advisor_roles: Set(form_data.advisor_roles.to_owned()),
      roles: Set(form_data.roles.to_owned()),
    }
    .insert(db)
    .await
  }

  pub async fn update_character_by_id(
    db: &DbConn,
    id: String,
    form_data: character::Model
  ) -> Result<character::Model, DbErr> {
    let character: character::ActiveModel = Character::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find character:".to_owned()))
      .map(Into::into)?;

    character::ActiveModel {
      id: character.id,
      name: Set(form_data.name.to_owned()),
      tag: Set(form_data.tag.to_owned()),
      ideology: Set(form_data.ideology.to_owned()),
      leader_roles: Set(form_data.leader_roles.to_owned()),
      commander_traits: Set(form_data.commander_traits.to_owned()),
      advisor_roles: Set(form_data.advisor_roles.to_owned()),
      roles: Set(form_data.roles.to_owned()),
    }
    .update(db)
    .await
  }

  pub async fn delete_character(db: &DbConn, id: String) -> Result<DeleteResult, DbErr> {
    let character: character::ActiveModel = Character::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find character.".to_owned()))
      .map(Into::into)?;

    character.delete(db).await
  }

  pub async fn delete_all_characters(db: &DbConn) -> Result<DeleteResult, DbErr> {
    Character::delete_many().exec(db).await
  }
}

