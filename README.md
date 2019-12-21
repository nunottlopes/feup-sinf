- To start the database run: `docker-compose up -d`

- Inside server folder add an .env file unsing the file .env.template as a template

- To run both the client and the server do:

```
-> npm install
-> npm start
```

If it's the first time running the server, you need to make a get call to this endpoint to initialize the database: http://localhost:3001/api/parse/saft
