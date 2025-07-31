terraform {
  backend "gcs" {
    bucket = "termopilas-terraform-states"
    prefix = "website"
  }
}