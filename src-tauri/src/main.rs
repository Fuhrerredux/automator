// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Window, Manager};
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
use entity::focus;
use entity::node;
use entity::edge;

#[tokio::main]
async fn main() {
  // Initialize the tracing subscriber with a maximum logging level of ERROR
  let subscriber = fmt::Subscriber::builder()
      .with_max_level(LevelFilter::INFO) // Comment if you want to show DEBUG messages
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
      list_all_characters,
      get_character,
      create_focus,
      update_focus,
      delete_focus,
      purge_focuses,
      list_focuses,
      list_all_focuses,
      get_focus,
      create_node,
      update_node,
      delete_node,
      purge_nodes,
      // list_nodes,
      list_all_nodes,
      get_node,
      get_node_count,
      create_edge,
      update_edge,
      delete_edge,
      purge_edges,
      list_all_edges,
      get_edge,
      get_edge_by_source,
      get_edge_by_target,
      close_splashscreen
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn close_splashscreen(window: Window) {
  print!("CLOSING SLAPSHCREEN");
  window.get_window("splashscreen").expect("no window labeled 'splashscreen' found").close().unwrap();
  window.get_window("main").expect("no window labeled main found").show().unwrap();
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
  let characters_per_page = params.limit.unwrap_or(10);

  let (chars, num_pages) = QueryCore::find_characters_in_page(&state.conn, page, characters_per_page)
    .await
    .expect("Cannot find characters in page");

  println!("num_pages: {}", num_pages);

  Ok(chars)
}

#[tauri::command]
async fn list_all_characters(
  state: tauri::State<'_, AppState>
) -> Result<Vec<character::Model>, ()> {
  let chars = QueryCore::find_characters(&state.conn).await;
  let characters  = chars.unwrap();

  Ok(characters)
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

#[tauri::command]
async fn create_focus(state: tauri::State<'_, AppState>, form: focus::Model) -> Result<Broadcast, ()> {
  let _ = &state.conn;

  MutationCore::create_focus(&state.conn, form)
    .await
    .expect("could not insert focus");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.focus.created".to_owned()
  };
  Ok(data)
}

#[tauri::command]
async fn update_focus(
  state: tauri::State<'_, AppState>,
  id: String,
  form: focus::Model
)-> Result<Broadcast, ()> {
  MutationCore::update_focus_by_id(&state.conn, id, form)
    .await
    .expect("could not edit focus");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.focus.updated".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn delete_focus(
  state: tauri::State<'_, AppState>,
  id: String,
) -> Result<Broadcast, ()> {
  MutationCore::delete_focus(&state.conn, id)
    .await
    .expect("could not delete focus");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.focus.removed".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn purge_focuses(
  state: tauri::State<'_, AppState>,
) -> Result<Broadcast, ()> {
  MutationCore::delete_all_focuses(&state.conn)
    .await
    .expect("could not purge all focuses");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.focus.purged".to_owned()
  };

  Ok(data)
}

#[tauri::command]
async fn list_focuses(
  state: tauri::State<'_, AppState>,
  params: ListParams,
) -> Result<Vec<focus::Model>, ()> {
  let page = params.page.unwrap_or(1);
  let focuses_per_page = params.limit.unwrap_or(10);

  let (focuses, num_pages) = QueryCore::find_focuses_in_page(&state.conn, page, focuses_per_page)
    .await
    .expect("Cannot find focuses in page");

  println!("num_pages: {}", num_pages);

  Ok(focuses)
}

#[tauri::command]
async fn list_all_focuses(
  state: tauri::State<'_, AppState>
) -> Result<Vec<focus::Model>, ()> {
  let focs = QueryCore::find_focuses(&state.conn).await;
  let focuses  = focs.unwrap();

  Ok(focuses)
}

#[tauri::command]
async fn get_focus(
  state: tauri::State<'_, AppState>,
  params: GetParams
) -> Result<focus::Model, ()> {
  let id = params.id;
  let focus = QueryCore::find_focus_by_id(&state.conn, id).await.expect("Cannot find focus");
  let data = focus.unwrap();

  Ok(data)
}

// nodes

#[tauri::command]
async fn create_node(state: tauri::State<'_, AppState>, form: node::Model) -> Result<Broadcast, ()> {
  let _ = &state.conn;

  MutationCore::create_node(&state.conn, form)
    .await
    .expect("could not insert focus");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.node.created".to_owned()
  };
  Ok(data)
}

#[tauri::command]
async fn update_node(
  state: tauri::State<'_, AppState>,
  id: String,
  form: node::Model
)-> Result<Broadcast, ()> {
  MutationCore::update_node_by_id(&state.conn, id, form)
    .await
    .expect("could not edit node");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.node.updated".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn delete_node(
  state: tauri::State<'_, AppState>,
  id: String,
) -> Result<Broadcast, ()> {
  MutationCore::delete_node(&state.conn, id)
    .await
    .expect("could not delete node");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.node.removed".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn purge_nodes(
  state: tauri::State<'_, AppState>,
) -> Result<Broadcast, ()> {
  MutationCore::delete_all_nodes(&state.conn)
    .await
    .expect("could not purge all nodes");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.node.purged".to_owned()
  };

  Ok(data)
}

// #[tauri::command]
// async fn list_nodes(
//   state: tauri::State<'_, AppState>,
//   params: ListParams,
// ) -> Result<Vec<node::Model>, ()> {
//   let page = params.page.unwrap_or(1);
//   let focuses_per_page = params.limit.unwrap_or(10);

//   let (focuses, num_pages) = QueryCore::find_nodes_in_page(&state.conn, page, focuses_per_page)
//     .await
//     .expect("Cannot find nodes in page");

//   println!("num_pages: {}", num_pages);

//   Ok(focuses)
// }

#[tauri::command]
async fn list_all_nodes(
  state: tauri::State<'_, AppState>
) -> Result<Vec<node::Model>, ()> {
  let focs = QueryCore::find_nodes(&state.conn).await;
  let focuses  = focs.unwrap();

  Ok(focuses)
}

#[tauri::command]
async fn get_node(
  state: tauri::State<'_, AppState>,
  params: GetParams
) -> Result<node::Model, ()> {
  let id = params.id;
  let node = QueryCore::find_node_by_id(&state.conn, id).await.expect("Cannot find node");
  let data = node.unwrap();

  Ok(data)
}

#[tauri::command]
async fn get_node_count(
  state: tauri::State<'_, AppState>,
) -> Result<u64, ()> {
  let count = QueryCore::get_count(&state.conn).await.expect("Cannot find nodes");
  Ok(count)
}

#[tauri::command]
async fn create_edge(state: tauri::State<'_, AppState>, form: edge::Model) -> Result<Broadcast, ()> {
  let _ = &state.conn;

  MutationCore::create_edge(&state.conn, form)
    .await
    .expect("could not insert edge");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.edge.created".to_owned()
  };
  Ok(data)
}

#[tauri::command]
async fn update_edge(
  state: tauri::State<'_, AppState>,
  id: String,
  form: edge::Model
)-> Result<Broadcast, ()> {
  MutationCore::update_edge_by_id(&state.conn, id, form)
    .await
    .expect("could not edit edge");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.edge.updated".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn delete_edge(
  state: tauri::State<'_, AppState>,
  id: String,
) -> Result<Broadcast, ()> {
  MutationCore::delete_edge(&state.conn, id)
    .await
    .expect("could not delete edge");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.edge.removed".to_owned(),
  };

  Ok(data)
}

#[tauri::command]
async fn purge_edges(
  state: tauri::State<'_, AppState>,
) -> Result<Broadcast, ()> {
  MutationCore::delete_all_edges(&state.conn)
    .await
    .expect("could not purge all edges");

  let data = Broadcast {
    kind: "success".to_owned(),
    message: "status.edge.purged".to_owned()
  };

  Ok(data)
}

#[tauri::command]
async fn list_all_edges(
  state: tauri::State<'_, AppState>
) -> Result<Vec<edge::Model>, ()> {
  let edgs = QueryCore::find_edges(&state.conn).await;
  let edges  = edgs.unwrap();

  Ok(edges)
}

#[tauri::command]
async fn get_edge(
  state: tauri::State<'_, AppState>,
  params: GetParams
) -> Result<edge::Model, ()> {
  let id = params.id;
  let edge = QueryCore::find_edge_by_id(&state.conn, id).await.expect("Cannot find edge");
  let data = edge.unwrap();

  Ok(data)
}

#[tauri::command]
async fn get_edge_by_source(
  state: tauri::State<'_, AppState>,
  source_id: String,
) -> Result<Vec<edge::Model>, ()> {
  let edge = QueryCore::find_connections_by_source(&state.conn, &source_id).await;

  match edge {
    Ok(conns) => Ok(conns),
    Err(_) => Err(()),
  }
}

#[tauri::command]
async fn get_edge_by_target(
  state: tauri::State<'_, AppState>,
  target_id: String,
) -> Result<Vec<edge::Model>, ()> {
  let edges = QueryCore::find_connections_by_target(&state.conn, &target_id).await;

  match edges {
    Ok(conns) => Ok(conns),
    Err(_) => Err(()),
  }
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
  limit: Option<u64>,
}

#[derive(Deserialize)]
struct GetParams {
  id: String
} 