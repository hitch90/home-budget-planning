## Description
@todo

#### Swagger
http://localhost:3000/api/

## Installation

```bash
$ npm install
```

## Config

#### Database
Create file `.env` with database configuration:
```$xslt
host=
username=
password=
database=
```

#### Users
Create file `src/config/users.ts`, for example:
```ts
export const users = [
    {
        userId: 1,
        username: 'maria',
        password: 'guess',
    },
]
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
