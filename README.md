# genshin-web

Frontend tipo **gacha** de Genshin Impact para el Taller DevOps. Consume la API de [genshin-api](https://github.com/Br1-Filippi/genshin-api).

- **Gacha:** tiradas ×1 y ×10, con un 10 % de probabilidad de 5★ y un 5★ garantizado cada 10 tiradas.
- **Catálogo:** los 92 personajes, con búsqueda y filtros por elemento y nación, y una ficha con la tarjeta y los datos de cada uno (en español cuando hay traducción).

Hecho con React 19 + Vite + TypeScript, con tests en Vitest + Testing Library (100 % de coverage).

## Arquitectura

```
navegador ──> genshin-web (nginx :80) ──/api/*──> genshin-api (:5000)
```

nginx sirve la aplicación compilada y redirige `/api/*` al contenedor de la API dentro de la misma red de Docker. El contenedor de la API se indica con las variables `API_HOST` y `API_PORT`.

## Ejecutar

```bash
npm ci
npm test         # tests + coverage (coverage/lcov.info)
npm run build    # compila a dist/
npm run dev      # desarrollo; /api apunta a http://localhost:4000 (cambiar con API_URL)
```

Con Docker (después de `npm run build`, con la API corriendo en la red `genshin-prod`):

```bash
docker build -t genshin-web .
docker run -d --name genshin-web-prod --network genshin-prod \
  -e API_HOST=genshin-api-prod -p 3000:80 genshin-web
```

## Ramas

- `main`: rama base.
- `dev`: integración.
- `feature/**`: desarrollo; las construye el job de Jenkins `genshin_web_dev` (puerto 3001).
- `release/**`: versiones a producción; las construye el job `genshin_web_prod` (puerto 3000).
