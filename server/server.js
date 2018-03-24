let path = require('path');
let _ = require('lodash');
let bodyParser = require('body-parser');
let express = require('express');

const publicPath = path.join(__dirname, '../dist');
const envFile = require('node-env-file');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

try {
	envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
} catch(e) {

}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`Server is running on port`, port)
});

module.exports = { app };