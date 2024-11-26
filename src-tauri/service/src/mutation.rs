use ::entity::{ 
  character, 
  focus, 
  node, 
  edge,
  character::Entity as Character, 
  focus::Entity as Focus, 
  node::Entity as Node, 
  edge::Entity as Edge,
};
use sea_orm::*;

pub struct Mutation;

impl Mutation {
  
  // character-related

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
      commander_roles: Set(form_data.commander_roles.to_owned()),
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
      commander_roles: Set(form_data.commander_roles.to_owned()),
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

  // focus-related

  pub async fn create_focus(
    db: &DbConn,
    form_data: focus::Model,
  ) -> Result<focus::Model, DbErr> {
    focus::ActiveModel {
      id: Set(form_data.id.to_owned()),
      name: Set(form_data.name.to_owned()),
      tag: Set(form_data.tag.to_owned()),
      position_x: Set(form_data.position_x.to_owned()),
      position_y: Set(form_data.position_y.to_owned()),
      relatives: Set(form_data.relatives.to_owned()),
      prerequisites: Set(form_data.prerequisites.to_owned()),
      exclusives: Set(form_data.exclusives.to_owned()),
      cost: Set(form_data.cost.to_owned())
    }
    .insert(db)
    .await
  }

  pub async fn update_focus_by_id(
    db: &DbConn,
    id: String,
    form_data: focus::Model
  ) -> Result<focus::Model, DbErr> {
    let focus: focus::ActiveModel = Focus::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find focus:".to_owned()))
      .map(Into::into)?;

    focus::ActiveModel {
      id: focus.id,
      name: Set(form_data.name.to_owned()),
      tag: Set(form_data.tag.to_owned()),
      position_x: Set(form_data.position_x.to_owned()),
      position_y: Set(form_data.position_y.to_owned()),
      relatives: Set(form_data.relatives.to_owned()),
      prerequisites: Set(form_data.prerequisites.to_owned()),
      exclusives: Set(form_data.exclusives.to_owned()),
      cost: Set(form_data.cost.to_owned())
    }
    .update(db)
    .await
  }

  
  pub async fn delete_focus(db: &DbConn, id: String) -> Result<DeleteResult, DbErr> {
    let focus: focus::ActiveModel = Focus::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find focus.".to_owned()))
      .map(Into::into)?;

    focus.delete(db).await
  }

  pub async fn delete_all_focuses(db: &DbConn) -> Result<DeleteResult, DbErr> {
    Focus::delete_many().exec(db).await
  }

  // node-related

  pub async fn create_node(
    db: &DbConn,
    form_data: node::Model,
  ) -> Result<node::Model, DbErr> {
    node::ActiveModel {
      id: Set(form_data.id.to_owned()),
      position: Set(form_data.position.to_owned()),
      label: Set(form_data.label.to_owned()),
      r#type: Set(form_data.r#type.to_owned())
    }
    .insert(db)
    .await
  }

  pub async fn update_node_by_id(
    db: &DbConn,
    id: String,
    form_data: node::Model
  ) -> Result<node::Model, DbErr> {
    let node: node::ActiveModel = Node::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find node:".to_owned()))
      .map(Into::into)?;

    node::ActiveModel {
      id: node.id,
      position: Set(form_data.position.to_owned()),
      label: Set(form_data.label.to_owned()),
      r#type: Set(form_data.r#type.to_owned()),
    }
    .update(db)
    .await
  }

  pub async fn delete_node(db: &DbConn, id: String) -> Result<DeleteResult, DbErr> {
    let node: node::ActiveModel = Node::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find node.".to_owned()))
      .map(Into::into)?;

    node.delete(db).await
  }

  pub async fn delete_all_nodes(db: &DbConn) -> Result<DeleteResult, DbErr> {
    Node::delete_many().exec(db).await
  } 

  // edge-related

  pub async fn create_edge(
    db: &DbConn,
    form_data: edge::Model,
  ) -> Result<edge::Model, DbErr> {
    edge::ActiveModel {
      id: Set(form_data.id.to_owned()),
      source: Set(form_data.source.to_owned()),
      target: Set(form_data.target.to_owned()),
      label: Set(form_data.label.to_owned()),
      r#type: Set(form_data.r#type.to_owned())
    }
    .insert(db)
    .await
  }

  pub async fn update_edge_by_id(
    db: &DbConn,
    id: String,
    form_data: edge::Model
  ) -> Result<edge::Model, DbErr> {
    let edge: edge::ActiveModel = Edge::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find edge:".to_owned()))
      .map(Into::into)?;

    edge::ActiveModel {
      id: edge.id,
      source: Set(form_data.source.to_owned()),
      target: Set(form_data.target.to_owned()),
      label: Set(form_data.label.to_owned()),
      r#type: Set(form_data.r#type.to_owned())
    }
    .update(db)
    .await
  }

  pub async fn delete_edge(db: &DbConn, id: String) -> Result<DeleteResult, DbErr> {
    let edge: edge::ActiveModel = Edge::find_by_id(id)
      .one(db)
      .await?
      .ok_or(DbErr::Custom("Cannot find edge.".to_owned()))
      .map(Into::into)?;

      edge.delete(db).await
  }

  pub async fn delete_all_edges(db: &DbConn) -> Result<DeleteResult, DbErr> {
    Edge::delete_many().exec(db).await
  }

}

