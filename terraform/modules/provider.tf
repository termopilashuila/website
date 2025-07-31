provider "google" {
  project = local.config.project
  region  = local.config.location
}