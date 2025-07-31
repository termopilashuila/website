module "infrastructure" {
  source = "./modules"

  # Pass configuration to the module
  config = local.config
}