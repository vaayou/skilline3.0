const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body);
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);
  console.log(data);
  

  let options = {
    url: "https://us10.api.mailchimp.com/3.0/lists/5377c079ce",
    method: "POST",
    headers: {
      Authorization: "Pawan 83d61f92e2d8568ce0b4edaf706b96f2-us10",
    },
    body: jsonData,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      console.log(response.statusCode);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});


