#!/bin/sh
# generate-env-config.sh

echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  VITE_API_URL: \"$VITE_API_URL\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_SOME_KEY: \"$VITE_SOME_KEY\"" >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js

echo "Generated env-config.js with VITE_API_URL=$VITE_API_URL (from container env)"