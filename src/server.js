const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const sqlite3 = require('sqlite3').verbose();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
data = (res, sql) => {
    // open database in memory
    let db = new sqlite3.Database('./db/franklin.db', (err) => {
        if (err) {
        return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });
    db.all(sql, [], (err, table) => {
        if (err) {
        throw err;
        }
        // console.log(table);
        return res.send(table);
    });    
    // close the database connection
    db.close((err) => {
        if (err) {
        return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

app.get('/api/users', (req, res) => {
    sqlQuery = 'SELECT "_rowid_",* FROM "main"."users" ORDER BY "_rowid_"';
    return data(res, sqlQuery);
});

app.get('/api/items', (req, res) => {
    sqlQuery = 'SELECT "_rowid_",* FROM "main"."items" ORDER BY "_rowid_"';
    return data(res, sqlQuery);
});

app.get('/api/orders', (req, res) => {
    sqlQuery = 'SELECT "_rowid_",* FROM "main"."orders" ORDER BY "_rowid_"';
    return data(res, sqlQuery);
});

app.get('/api/order_items', (req, res) => {
    sqlQuery = 'SELECT "_rowid_",* FROM "main"."order_items" ORDER BY "_rowid_"';
    return data(res, sqlQuery);
});

app.get('/api/user_orders', (req, res) => {
    sqlQuery = 'SELECT main.order_items.rowid, * FROM main.orders INNER JOIN main.order_items ON main.order_items.order_id = main.orders.id ORDER BY user_id ';
    return data(res, sqlQuery);
});


// Implement post if have time - leave for example

// app.post('/api/update', (req, res) => {
//   console.log(req.body);
//   res.send(
//     `I received your POST request. This is what you sent me: ${req.body.post}`
//   );
// });

app.listen(port, () => console.log(`Listening on port ${port}`));