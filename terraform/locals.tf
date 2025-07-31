locals {
  config = jsondecode(file("./config.json"))

  # Common tags that can be applied to resources
  common_tags = {
    Project     = local.config.project
    Environment = "production"
    ManagedBy   = "terraform"
  }
}