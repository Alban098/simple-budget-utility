#!/bin/sh

# Extract the content of the JAR
mkdir app_tmp
unzip app.jar -d app_tmp
mkdir -p /BOOT-INF/classes/static

# Move frontend assets to have the Path from inside the JAR with the same root as the JAR
mv /app_tmp/BOOT-INF/classes/static/assets /BOOT-INF/classes/static

# Replace placeholders with the actual values loaded from the environment variables
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%client_id%%|$CLIENT_ID|g"
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%authority%%|$SSO_ISSUER_URL|g"
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 sed -i "s|%%redirect_url%%|$REDIRECT_URL|g"

# Patch the JAR in place
find /BOOT-INF/classes/static/assets/ \( -iname '*.js' -o -iname '*.js' \) -print0 | xargs -0 jar -uf app.jar

# Cleanup
rm -rf app_tmp
rm -rf BOOT-INF

# Actually starting the application
java -jar app.jar