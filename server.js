const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

// Set up the Express app
const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// app.post('/convert', upload.single('epsFile'), (req, res) => {
//   const epsFilePath = path.join(__dirname, 'uploads', req.file.originalname);
//   const outputSvgPath = path.join(__dirname, 'uploads', `${path.parse(req.file.originalname).name}.svg`);
//   const outputPdfPath = path.join(__dirname, 'uploads', `${path.parse(req.file.originalname).name}.pdf`);

//   console.log(`Converting file: ${epsFilePath}`);

//   // Step 1: Convert EPS to PDF using Ghostscript
//   exec(`gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPdfPath}" "${epsFilePath}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Ghostscript error: ${error.message}`);
//       return res.status(500).send('Failed to convert EPS to PDF.');
//     }

//     console.log('Ghostscript stdout:', stdout);
//     console.error('Ghostscript stderr:', stderr);

//     // Step 2: Convert PDF to SVG using Inkscape
//     exec(`inkscape "${outputPdfPath}" --export-type=svg --export-filename="${outputSvgPath}"`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Inkscape error: ${error.message}`);
//         return res.status(500).send('Failed to convert PDF to SVG.');
//       }

//       console.log('Inkscape stdout:', stdout);
//       console.error('Inkscape stderr:', stderr);

//       // Send the converted SVG file to the client
//       res.download(outputSvgPath, 'converted.svg', (err) => {
//         if (err) {
//           console.error('Error during file download:', err);
//           res.status(500).send('Error during download.');
//         }

//         // Cleanup: Remove uploaded and generated files after download
//         fs.unlink(epsFilePath, () => { });
//         fs.unlink(outputSvgPath, () => { });
//         fs.unlink(outputPdfPath, () => { });
//       });
//     });
//   });
// });

app.post('/convert', upload.single('epsFile'), (req, res) => {
  const epsFilePath = path.join(__dirname, 'uploads', req.file.originalname);
  const outputSvgPath = path.join(__dirname, 'uploads', `${path.parse(req.file.originalname).name}.svg`);
  const outputPdfPath = path.join(__dirname, 'uploads', `${path.parse(req.file.originalname).name}.pdf`);

  console.log(`Converting file: ${epsFilePath}`);

  exec(`gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPdfPath}" "${epsFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ghostscript error: ${error.message}`);
      return res.status(500).send('Failed to convert EPS to PDF.');
    }

    exec(`inkscape "${outputPdfPath}" --export-type=svg --export-filename="${outputSvgPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Inkscape error: ${error.message}`);
        return res.status(500).send('Failed to convert PDF to SVG.');
      }

      // Read the SVG content
      fs.readFile(outputSvgPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading SVG file:', err);
          return res.status(500).send('Failed to read SVG file.');
        }

        // Send the SVG content as a response
        res.json({ svgContent: data });

        // Cleanup
        fs.unlink(epsFilePath, () => { });
        fs.unlink(outputPdfPath, () => { });
      });
    });
  });
});


// Start the server
const PORT = process.env.PORT || 3000 || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
