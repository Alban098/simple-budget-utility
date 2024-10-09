#!/bin/sh
mkdir app_tmp
unzip app.jar -d app_tmp
mkdir -p /BOOT-INF/classes/static
mv /app_tmp/BOOT-INF/classes/static/assets /BOOT-INF/classes/static
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%client_id%%|$CLIENT_ID|g"
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%authority%%|$SSO_ISSUER_URL|g"
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%redirect_url%%|$REDIRECT_URL|g"
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 jar -uf app.jar
rm -rf app_tmp
rm -rf BOOT-INF
java -jar app.jar