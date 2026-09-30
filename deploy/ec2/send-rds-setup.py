"""Run through the official asm-exec wrapper; forward secrets via SSH stdin only."""
import json
import os
import subprocess
import sys

try:
    payload = json.dumps({
        "host": os.environ["ZANICH_RDS_HOST"],
        "owner": json.loads(os.environ["ZANICH_OWNER_CREDENTIAL"]),
        "app": json.loads(os.environ["ZANICH_APP_CREDENTIAL"]),
    })
    # Do not forward AWS or database credential environment variables to SSH.
    child_env = {key: value for key, value in os.environ.items()
                 if not key.startswith(("AWS_", "ZANICH_"))}
    completed = subprocess.run([
        "ssh", "-i", sys.argv[1], "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=yes", "-o", "ConnectTimeout=15",
        sys.argv[2], "sudo /usr/bin/node /srv/zanich/current/deploy/ec2/provision-rds.mjs",
    ], input=payload, text=True, env=child_env, timeout=120)
    sys.exit(completed.returncode)
except (KeyError, ValueError, OSError, subprocess.TimeoutExpired):
    print("Database setup could not complete; no credential values were logged.", file=sys.stderr)
    sys.exit(1)
