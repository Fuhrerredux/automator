// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tracing_subscriber::filter::LevelFilter;
use tracing_subscriber::fmt;

use migration::{Migrator,MigratorTrait};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use service::{
  sea_orm::{Database,DatabaseConnection},
  Mutation as MutationCore, Query as QueryCore
};
use entity::character;

#[tokio::main]
async fn main() {
  // Initialize the tracing subscriber with a maximum logging level of ERROR
  let subscriber = fmt::Subscriber::builder()
      .with_max_level(LevelFilter::ERROR)
      .finish();

  tracing::subscriber::set_global_default(subscriber)
      .expect("setting default subscriber failed");

  // Set environment variables
  env::set_var("RUST_LOG", "debug");

  dotenvy::dotenv().ok();

  let home_dir = match tauri::api::path::home_dir() {
    Some(val) => val,
    None => panic!("Could not get home directory")
  };
  let data_dir = home_dir.join(".automator/data");
  if let Err(_) = fs::metadata(&data_dir) {
    fs::create_dir_all(&data_dir).expect("Could not create data directory");
  }

  let db_url = "sqlite://".to_string() + data_dir.to_str().unwrap() + "/db.sqlite?mode=rwc";
  // let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");

  let conn = Database::connect(db_url)
    .await
    .expect("Database connection failed");
  Migrator::up(&conn, None).await.unwrap();

  let state = AppState { conn };

  tauri::Builder::default()
    .manage(state)
    .invoke_handler(tauri::generate_handler![
      create_character,
      update_character,
      delete_character,
      purge_characters,
      list_characters,
      get_character
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn create_character(state: tauri::State<'_, AppState>, form: character::Model) -> Result<Broadcast, ()> {
  let _ = &state.conn;

  MutationCore::create_character(&state.conn, form)
    .await
    .expect("could not insert character");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.character.created".to_owned()
  };
  Ok(data)
}

#[tauri::command]
async fn update_character(
  state: tauri::State<'_, AppState>,
  id: String,
  form: character::Model
)-> Result<Broadcast, ()> {
  MutationCore::update_character_by_id(&state.conn, id, form)
    .await
    .expect("could not edit character");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.character.updated".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn delete_character(
  state: tauri::State<'_, AppState>,
  id: String,
) -> Result<Broadcast, ()> {
  MutationCore::delete_character(&state.conn, id)
    .await
    .expect("could not delete character");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.character.removed".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn purge_characters(
  state: tauri::State<'_, AppState>,
) -> Result<Broadcast, ()> {
  MutationCore::delete_all_characters(&state.conn)
    .await
    .expect("could not purge all characters");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.character.purged".to_owned()
  };

  Ok(data)
}

#[tauri::command]
async fn list_characters(
  state: tauri::State<'_, AppState>,
  params: ListParams,
) -> Result<Vec<character::Model>, ()> {
  let page = params.page.unwrap_or(1);
  let characters_per_page = params.characters_per_page.unwrap_or(5);

  let (chars, num_pages) = QueryCore::find_characters_in_page(&state.conn, page, characters_per_page)
    .await
    .expect("Cannot find characters in page");

  println!("num_pages: {}", num_pages);

  Ok(chars)
}

#[tauri::command]
async fn get_character(
  state: tauri::State<'_, AppState>,
  params: GetParams
) -> Result<character::Model, ()> {
  let id = params.id;
  let character = QueryCore::find_character_by_id(&state.conn, id).await.expect("Cannot find character");
  let data = character.unwrap();

  Ok(data)
}

#[derive(Clone)]
struct AppState {
  conn: DatabaseConnection
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct Broadcast {
  kind: String,
  message: String,
}

#[derive(Deserialize)]
struct ListParams {
  page: Option<u64>,
  characters_per_page: Option<u64>,
}

#[derive(Deserialize)]
struct GetParams {
  id: String
} 