import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Initialize multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

export default function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('epsFile')(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: 'File upload failed.' });
      }

      const epsFilePath = path.join('/tmp', req.file.originalname);
      const outputPdfPath = path.join('/tmp', `${path.parse(req.file.originalname).name}.pdf`);
      const outputSvgPath = path.join('/tmp', `${path.parse(req.file.originalname).name}.svg`);

      // Convert EPS to PDF using Ghostscript
      exec(`gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPdfPath}" "${epsFilePath}"`, (error) => {
        if (error) {
          return res.status(500).json({ error: 'Ghostscript conversion failed.' });
        }

        // Convert PDF to SVG using Inkscape
        exec(`inkscape "${outputPdfPath}" --export-type=svg --export-filename="${outputSvgPath}"`, (error) => {
          if (error) {
            return res.status(500).json({ error: 'Inkscape conversion failed.' });
          }

          fs.readFile(outputSvgPath, 'utf8', (err, data) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to read SVG file.' });
            }

            // Send the SVG file as a response
            res.status(200).json({ svgContent: data });

            // Clean up the temp files
            fs.unlink(epsFilePath, () => {});
            fs.unlink(outputPdfPath, () => {});
            fs.unlink(outputSvgPath, () => {});
          });
        });
      });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}