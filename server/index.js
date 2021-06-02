const fs = require('fs');
// const multer = require('multer')
const express = require("express");
const Tesseract = require('tesseract.js')

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/uploads/:id", (req, res) => {
    console.log(__dirname)
      res.send( fs.readFileSync(`${__dirname}\\uploads\\${req.params.id}`));
    });
  
  
    const fileUpload = require('express-fileupload');
    app.use(fileUpload({debug:true}));
  
    // Upload Endpoint
    app.post("/upload", (req, res) => {
      if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
    
      const file = req.files.file;
    
    
      file.mv(`${__dirname}\\uploads\\${file.name}`, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
    
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
      });
    });