let express = require('express');

let app = express();

app.use(express.static(__dirname+'/dist/sem2-workspace'));

app.get('/*', (req, resp) => {
    resp.sendFile(__dirname+'/dist/sem2-workspace/index.html');
})

app.listen(process.env.PORT || 8080);