#!/usr/bin/env bash
# Start script for hosts without a shell/pre-deploy step (e.g. Render free tier).
set -e

python manage.py migrate --noinput
python manage.py seed_data   # idempotent: governorates, cities, categories

# Optional demo data: set SEED_TEST_PROPERTIES=<count> to fill an empty database once.
if [ -n "${SEED_TEST_PROPERTIES:-}" ]; then
  if [ "$(python manage.py shell -c 'from properties.models import Property; print(Property.objects.count())' 2>/dev/null | tail -1)" = "0" ]; then
    python manage.py generate_test_properties --count "$SEED_TEST_PROPERTIES"
  fi
fi

exec gunicorn mulkibh.wsgi --bind 0.0.0.0:${PORT:-8000} --log-file -
