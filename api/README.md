### steps :

1. set env from .dev.env
2. start redis container using docker or install redis globally :
   - docker :
     ```
     docker run --name my-redis -p 6380:6379 -d redis
     ```
3. - install dependencies

     ```
     yarn
     ```

   - and start the project

     ```
     yarn run dev
     ```
