// index.js  Ryan Speirs 600152989
//  Use Postman to query this server with http://localhost:3000/<operation name> 
//  and the json message in the format of:
//
//  {
//      "num1" : 5,
//      "num2" : 3
//  }


//  sets up our use of express middleware
const { error } = require('console');
const express = require('express');
const app = express();

//  middleware to parse JSON requests
app.use(express.json());

//  Serve static files
app.use(express.static(__dirname))

//  landing page if we goto it via browser
app.get('/', (req, res) =>{
    res.send('Welcome to the Calculator Microservice!');
});

// catches errors from incorrect JSON syntax, ie sending raw text characters
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'Malformed JSON in request body' });
    }
    next(); 
  });

// because the above catches raw syntax errors, but passes strings, we need this too
function validateInpute(req, res, next) {
    const { num1, num2} = req.body;

    // if either the first or second number are not a number, we return an error
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
        return res.status(400).json({error: 'Invalid input. num1 and num2 must be numbers.'});
    }

    next();
}

// addition function
app.post('/add', validateInpute, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ result: num1 + num2});
});

// subtraction function
app.post('/subtract', validateInpute, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ result: num1 - num2});
});

//  Mulitplication function
app.post('/multiply', validateInpute, (req, res) => {
    const { num1, num2 } = req.body;
    res.json({ result: num1 * num2});
});

//  divide function, with protection from divide by zero
app.post('/divide', validateInpute, (req, res) => {
    const { num1, num2 } = req.body;
   if (num2 === 0) {
    return res.status(400).json({error: 'Cannont divide by zero.'});
   }
   res.json({result: num1 / num2 });
});

//  The 404 handler 
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found'});
});

//  start the server, using port 3000 
const server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
});