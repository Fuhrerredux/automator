#[cfg(feature="mock")]
pub fn prepare_mock_db() -> DatabaseConnection {

  MockDatabase::new(DatabaseBackend::Postgres)
    .append_query_results([
      [characters::Model {
        id: "XXX".to_owned(),
        name: "Joachim von Ribbentrop".to_owned(),
        tag: "GER".to_owned()
      }],
      [characters::Model {
        id: "YYY".to_owned(),
        name: "Adam Dressler".to_owned(),
        tag: "GER".to_owned()
      }],
      [characters::Model {
        id: "ZZZ".to_owned(),
        name: "Edward VIII".to_owned(),
        tag: "ENG".to_owned()
      }],
      [characters::Model {
        id: "AAA".to_owned(),
        name: "Chiang Kai-Shek".to_owned(),
        tag: "CHI".to_owned()
      }],
      [characters::Model {
        id: "BBB".to_owned(),
        name: "Benito Mussolini".to_owned(),
        tag: "ITA".to_owned()
      }],
      [characters::Model {
        id: "CCC".to_owned(),
        name: "Floyd Olson".to_owned(),
        tag: "USA".to_owned()
      }]
    ]).append_exec_results([
      MockExecResult {
          last_insert_id: 6,
          rows_affected: 1,
      },
      MockExecResult {
          last_insert_id: 6,
          rows_affected: 5,
      },
  ])
  .into_connection()
}