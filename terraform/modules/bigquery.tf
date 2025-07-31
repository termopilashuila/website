# resource "google_bigquery_dataset" "default" {
#   dataset_id                      = local.config.app_name
#   friendly_name                   = local.config.app_name
#   project                         = local.config.project
#   location                        = "us-central1"
#   delete_contents_on_destroy      = false
#   default_table_expiration_ms     = null
#   default_partition_expiration_ms = 0
#   is_case_insensitive             = false
# }

resource "google_bigquery_dataset" "searchconsole" {
  dataset_id                      = "searchconsole_termopilasco"
  friendly_name                   = "searchconsole_termopilasco"
  description                     = "Dataset for Search Console export. All data is written by a robot user. For more information visit https://support.google.com/webmasters/answer/12918484"
  project                         = local.config.project
  location                        = "us-central1"
  delete_contents_on_destroy      = false
  default_table_expiration_ms     = null
  default_partition_expiration_ms = 0
  is_case_insensitive             = false
}

data "google_iam_policy" "iam_policy" {
  binding {
    role = "roles/bigquery.dataOwner"
    members = [
      "user:cecabrera55@gmail.com",
      "serviceAccount:${google_service_account.sa.email}",
    ]
  }
  binding {
    role = "roles/bigquery.dataEditor"
    members = [
      "serviceAccount:search-console-data-export@system.gserviceaccount.com",
    ]
  }
}

# resource "google_bigquery_dataset_iam_policy" "dataset_iam_policy_default" {
#   dataset_id  = google_bigquery_dataset.default.dataset_id
#   policy_data = data.google_iam_policy.iam_policy.policy_data
# }
resource "google_bigquery_dataset_iam_policy" "dataset_iam_policy_searchconsole" {
  dataset_id  = google_bigquery_dataset.searchconsole.dataset_id
  policy_data = data.google_iam_policy.iam_policy.policy_data
}
