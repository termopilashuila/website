# resource "google_cloud_run_v2_job" "cloud_run_job" {
#   for_each = local.config.services
#   name     = "${local.config.app_name}-${each.key}-job"
#   location = local.config.location
#   project  = local.config.project
#   client   = "cloud-console"

#   template {
#     template {
#       timeout         = "86400s"
#       service_account = google_service_account.sa.email
#       max_retries     = 1
#       containers {
#         image = "${local.config.location}-docker.pkg.dev/${local.config.project}/${local.config.artifact_repo_name}/${local.config.app_name}-${each.key}-image:latest"

#         name    = "${local.config.app_name}-${each.key}-image"
#         command = each.value.command
#         resources {
#           limits = {
#             cpu    = each.value.cpu
#             memory = each.value.ram
#           }
#         }
#       }
#     }
#   }
# }

