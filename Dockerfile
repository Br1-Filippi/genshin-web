# Imagen del frontend. Requiere haber compilado antes (npm run build -> dist/),
# que es lo que hace la etapa "Compilar" del job de Jenkins.
FROM nginx:1.29-alpine

# Contenedor de la API al que nginx redirige /api (se puede cambiar con -e).
ENV API_HOST=genshin-api \
    API_PORT=5000

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY dist /usr/share/nginx/html

EXPOSE 80
