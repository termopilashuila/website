locals {
  config = var.config

  tags = {
    Company     = "BRER"
    Application = "termopilas-app"
    Team        = "independent"
    Environment = "prod"
    Repo        = "deng"
  }
}
