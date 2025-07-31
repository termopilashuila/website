# resource "google_cloud_scheduler_job" "service_scheduler" {
#   for_each    = local.config.services
#   name        = "${local.config.app_name}-${each.key}-scheduler"
#   region      = local.config.location
#   project     = local.config.project
#   description = "Invoke the Cloud Run to ${each.key} the Finca Raiz data into Cloud Storage."
#   schedule    = each.value.cron
#   time_zone   = "Etc/UTC"
#   paused      = false

#   attempt_deadline = "180s"

#   retry_config {
#     max_backoff_duration = "3600s"
#     max_doublings        = 5
#     max_retry_duration   = "0s"
#     min_backoff_duration = "5s"
#     retry_count          = 0
#   }

#   http_target {
#     http_method = "POST"
#     uri         = "https://${local.config.location}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${local.config.project}/jobs/${local.config.app_name}-${each.key}-job:run"
#     headers     = {}

#     oauth_token {
#       scope                 = "https://www.googleapis.com/auth/cloud-platform"
#       service_account_email = google_service_account.sa.email
#     }
#   }
# }
