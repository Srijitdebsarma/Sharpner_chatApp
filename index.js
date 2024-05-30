const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/', (req, res) => {
    res.render('index');
});

const messagesFile = path.join(__dirname, 'messages.json');

app.post('/send', (req, res) => {
    const { username, message } = req.body;
    const newMessage = { username, message };

    fs.readFile(messagesFile, (err, data) => {
        let messages = [];
        if (!err) {
            messages = JSON.parse(data);
        }
        messages.push(newMessage);
        fs.writeFile(messagesFile, JSON.stringify(messages), (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('Message received');
        });
    });
});

app.get('/messages', (req, res) => {
    fs.readFile(messagesFile, (err, data) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        const messages = JSON.parse(data);
        res.json(messages);
    });
});
