# AWS deployment status

Last checked: 13 September 2026

## Live preview

- EC2 instance: `i-04bf6d500efd30e6d`
- Region: `us-east-1` (Amazon Linux 2023, `t2.micro`)
- Preview: `http://ec2-3-95-184-196.compute-1.amazonaws.com/`
- Process: Next.js 16.3.5 under systemd, behind Nginx
- Liveness: `GET /api/health` returns `{"status":"ok"}`
- Indexing: disabled with `X-Robots-Tag: noindex, nofollow`
- Preview checks: all public routes, 12 gallery images, 14 JavaScript bundles, image optimization, WhatsApp link, metadata and API boundaries passed

## Database

- CloudFormation stack: `zanich-preview-data`
- Database: `zanich-preview-data-postgres`
- Engine: PostgreSQL 18.6, `db.t4g.micro`, 20 GiB gp3
- Network: private RDS subnets and database security group; no public database ingress
- Protection: encrypted storage, managed owner secret, TLS enforcement, seven-day backups, deletion protection, Performance Insights and encrypted log group
- Schema: `inquiries`, `notification_outbox` and `rate_limits` migrated
- Runtime account: `zanich_app`; TLS and required table permissions were verified during setup

## Source checkpoints

- `b802df4` - AWS RDS foundation and EC2 deployment automation
- `b26eb37` - Linux line-ending preservation for deployment archives
- `ab6c8ed` - EC2 preview configuration and optional integration checks

## Remaining activation work

1. Apply the final protected `DATABASE_URL` shell-quoting fix to the active EC2 release and rerun `deploy/ec2/verify-runtime.sh`; this is a remote follow-up after the first runtime check exposed shell parsing of the URL query string.
2. Confirm the RDS CloudFormation stack reaches `CREATE_COMPLETE` and `MultiAZ=true` after its final modification completes.
3. Configure Resend credentials and HTTPS before enabling website intake. Until then, WhatsApp remains the working customer route.
4. Add a real domain or temporary TLS endpoint, then set `NEXT_PUBLIC_SITE_URL` and `DEPLOYMENT_STAGE` accordingly.
5. Push the three local deployment commits to `origin/codex/production-foundation` once the Git credential/approval limit clears.
6. Configure the EC2 role for application secret reads and Session Manager; rotate the current SSH key after the handoff.

No database password, API key or secret value is stored in this document.
