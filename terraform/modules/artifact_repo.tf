# resource "google_artifact_registry_repository" "default" {
#   project       = local.config.project
#   location      = local.config.location
#   repository_id = local.config.artifact_repo_name
#   description   = "Termópilas Services Artifact Repository"
#   format        = "DOCKER"
# }
