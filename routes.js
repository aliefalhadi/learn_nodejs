const fs = require("fs");

const routesHandler = (req, res) => {
  //  console.log(req);
  const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>belajar nodejs2</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>click</button></form></body>"
    );
    res.write("</head>");
    return res.end();
  }
  if (url === "/message" && req.method === "POST") {
    const body = [];
    console.log(req.data);

    req.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      console.log(message);

      fs.writeFile("test.txt", message, err => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>belajar nodejs</title></head>");
  res.write("<body><h1>Belajar NODEJS</h1></body>");
  res.write("</head>");
  res.end();
};

module.exports = {
  routesHandler,
  someText: "sometext"
};
