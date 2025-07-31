
resource "google_project_service" "enabled_apis" {
  project  = local.config.project
  for_each = toset(local.config.api_services)
  service  = each.key

  disable_on_destroy         = true
  disable_dependent_services = true
}