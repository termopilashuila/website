variable "config" {
  description = "Configuration object containing all the settings for the infrastructure"
  type = object({
    app_name                 = string
    project                  = string
    location                 = string
    remote_state_bucket_name = string
    artifact_repo_name       = string
    services = map(object({
      name    = string
      path    = string
      command = list(string)
      cron    = string
      cpu     = string
      ram     = string
      enabled = bool
    }))
    api_services = list(string)
    service_account = object({
      name = string
      role = object({
        id          = string
        permissions = list(string)
      })
    })
  })
}