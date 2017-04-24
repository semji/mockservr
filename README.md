# mockserver

## docker-compose override

```yaml
version: '2'

services:
  mockserver:
    command: npm run start-dev
    volumes:
      - ./app:/usr/src/app
    ports:
      - 8085:80
      - 8045:4580

  sass-watch:
    image: node:7
    command: npm run sass-watch
    working_dir: /usr/src/app
    volumes:
      - ./app:/usr/src/app
```