
resource "google_service_account" "sa" {
  project      = local.config.project
  account_id   = local.config.service_account.name
  display_name = "${local.config.service_account.name} service account"

  depends_on = [
    google_project_service.enabled_apis
  ]
}

# Custom role config
resource "google_project_iam_member" "sa_iam_custom" {

  project = local.config.project
  role    = google_project_iam_custom_role.jobs_role.id
  member  = "serviceAccount:${google_service_account.sa.email}"

  depends_on = [
    google_project_service.enabled_apis
  ]
}

resource "google_service_account_key" "sa_key" {
  service_account_id = google_service_account.sa.name
}

resource "google_project_iam_custom_role" "jobs_role" {
  role_id     = local.config.service_account.role.id
  title       = "Jobs Role created for project"
  description = "Role to execute remote jobs managed by Terraform."
  permissions = local.config.service_account.role.permissions
}

# Grant Search Console data export service account the bigquery.jobUser role at project level
resource "google_project_iam_member" "search_console_job_user" {
  project = local.config.project
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:search-console-data-export@system.gserviceaccount.com"

  depends_on = [
    google_project_service.enabled_apis
  ]
}

# Grant Search Console data export service account the bigquery.dataEditor role at project level
resource "google_project_iam_member" "search_console_data_editor" {
  project = local.config.project
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:search-console-data-export@system.gserviceaccount.com"

  depends_on = [
    google_project_service.enabled_apis
  ]
}
