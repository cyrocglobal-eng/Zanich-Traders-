# AWS EC2 launch plan

Target: `https://zanichtraders.co.ke`  
Application: Next.js 16 server deployment with PostgreSQL-backed quote and feedback intake

This plan is intentionally implementation-first and deployment-safe. It does not create AWS resources or transmit credentials.

## Recommended topology

```text
Visitors
   |
Route 53 DNS
   |
Application Load Balancer + ACM certificate (HTTPS)
   |
EC2 app instance (private subnet, Node.js, systemd, Next.js)
   |
RDS PostgreSQL (private subnet, app security group only)

EC2 -> Resend API
EC2 -> OpenAI API (optional)
EC2 -> AWS Secrets Manager / SSM via IAM instance role
EventBridge Scheduler -> authenticated outbox endpoint
CloudWatch -> logs, alarms and health signals
```

Use an ALB with an ACM certificate for HTTPS, then route the domain to the ALB. AWS documents that the certificate must be attached to the load balancer and its names must match the HTTPS hostname. citeturn7search5turn7search14

Use RDS PostgreSQL rather than PostgreSQL on the EC2 disk. RDS provides backups, point-in-time restore, Multi-AZ options, VPC placement and TLS support. Keep the database private and allow its security group to accept PostgreSQL traffic only from the EC2 application security group. citeturn7search4turn7search8turn7search9

## Build sequence

### 1. AWS account and region

- Confirm the AWS account, billing alerts and the deployment region.
- Prefer a region with acceptable latency and service availability for Kenyan visitors; confirm the choice against current AWS pricing and the account’s available services.
- Enable CloudTrail and tag resources with `Project=zanich`, `Environment=production`, and `Owner=zanich`.

### 2. Network and identity

- Use a VPC with public subnets for the ALB and private subnets for EC2 and RDS.
- ALB security group: inbound 80 and 443 from the internet; outbound to EC2.
- EC2 security group: inbound application traffic only from the ALB security group; no public SSH rule.
- RDS security group: inbound PostgreSQL only from the EC2 security group.
- Attach an EC2 instance role with Systems Manager access and narrowly scoped reads for the Zanich production secrets. Systems Manager supports instance roles and Session Manager access without opening inbound administration ports. citeturn7search1turn7search2turn7search10

### 3. RDS PostgreSQL

- Create a private PostgreSQL instance with encryption at rest, automated backups, deletion protection and automatic minor-version updates.
- Disable public access and enforce TLS from the application.
- Create a dedicated application database and least-privilege user. Keep migration privileges separate from the runtime user.
- Run `npm run db:migrate` once through a controlled deployment session, then verify the three application tables and indexes.
- Configure CloudWatch database logs and an alert for storage, connections, failed events and backup status.

RDS security controls to verify include no public access, encryption at rest, backups, deletion protection, log publishing and encryption in transit. citeturn7search8

### 4. EC2 application host

- Start a current Ubuntu LTS AMI on a small general-purpose instance sized for the expected first traffic; resize after observing memory and CPU rather than guessing from the landing page.
- Install Node.js 24 LTS, npm, Git and the Systems Manager Agent if not already present.
- Create a non-root `zanich` service user and a `/srv/zanich` release directory.
- Build with `npm ci && npm run build`; run with `npm start -- --hostname 0.0.0.0` behind the ALB.
- Run the process under systemd with restart-on-failure, a health endpoint check, a bounded memory limit and logs sent to journald/CloudWatch.
- Keep the instance root volume for application code only. Customer inquiry data belongs in RDS.

### 5. Secrets and configuration

Store credentials in Secrets Manager: `DATABASE_URL`, `RESEND_API_KEY`, `OPENAI_API_KEY`, `OUTBOX_SECRET` and `RATE_LIMIT_SALT`. Store nonsecret values in Parameter Store or the deployment environment: `NEXT_PUBLIC_SITE_URL`, `EMAIL_FROM`, `OPENAI_MODEL`, `TRUSTED_IP_HEADER`, `GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GTM_ID`, `SITE_INDEXABLE`, `NEXT_PUBLIC_ANALYTICS_ENABLED` and `BRANDS_SERVED_CONFIRMED`. AWS recommends Secrets Manager for credentials and API keys, with IAM controlling access. citeturn7search0turn7search7

The instance role should read only the `/zanich/production/*` secret paths. Do not place secrets in GitHub, `.env` files committed to the repository, user data, shell history or browser forms. Rebuild after changing values because the application’s public feature flags are evaluated during the build.

### 6. Domain and HTTPS

- Request an ACM public certificate for `zanichtraders.co.ke` and `www.zanichtraders.co.ke` in the ALB’s region.
- Validate the certificate with the required DNS records.
- Create Route 53 alias records for the root domain and `www` to the ALB.
- Add an HTTP listener redirecting to HTTPS and set the ALB health check to a lightweight public route.
- Confirm the certificate hostname, root redirect, canonical URL and external access before enabling indexing.

### 7. Email and outbox worker

- Verify the Resend sending domain and set `EMAIL_FROM` to the verified sender.
- Keep the recipient fixed as `zanichgeneraltraders@gmail.com`; customer email remains Reply-To.
- Schedule an authenticated request to `/api/internal/outbox` every minute using EventBridge Scheduler or a controlled worker. The endpoint processes three jobs per call.
- Add CloudWatch alarms for failed jobs, old pending jobs, repeated 503s and scheduler failures.
- Send one authorized test quote and one feedback item after the scheduler is live. Confirm exactly one message for each and verify idempotent retries.

### 8. Optional AI support

- Set the OpenAI key and approved structured-output model only if the team wants the assistant enabled at launch.
- Apply an OpenAI project spending limit and monitor usage.
- Verify the assistant answers pricing and fast-track questions with inquiry language, never invented prices or commitments.
- Confirm the assistant cannot send email, WhatsApp messages or external requests by itself.

### 9. Release process

- Create a production branch/tag from the reviewed `codex/production-foundation` work.
- On EC2, fetch the exact commit into a timestamped release directory.
- Install, migrate, build and run the smoke suite against the ALB hostname before switching traffic.
- Keep the previous release directory available for rollback.
- Switch the systemd symlink only after the health check and smoke suite pass.
- Record the deployed commit, migration version, environment version and rollback command.

### 10. Observability and recovery

- Send application and system logs to CloudWatch Logs with a retention period.
- Alert on ALB unhealthy hosts, 4xx/5xx spikes, EC2 status checks, memory/disk pressure, RDS storage/connections and outbox failures.
- Use Session Manager for controlled access and patching. AWS documents Session Manager and instance-role setup as the supported EC2 management path. citeturn7search2turn7search6
- Test an RDS restore before launch and document the recovery owner.
- Keep an AMI or launch configuration for rebuilding the host; do not rely on an irreplaceable hand-configured instance.

## Launch gate

Launch only when all of these are true: RDS migration and restore test pass; HTTPS and canonical redirects work; the production environment check passes; quote and feedback email delivery is confirmed; the outbox scheduler and alerts work; `SITE_INDEXABLE=true` is set only on the real domain; Search Console and GTM are verified; the owner confirms the 50+ claim; and rollback has been rehearsed.

The next execution decision is the AWS foundation: region, VPC/subnets, ALB, EC2 instance role, RDS instance and secret naming. Once those are chosen, the implementation can proceed in small reversible steps.
