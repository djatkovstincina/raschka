
# EPS to SVG Converter (Raschka)

A simple web application for converting EPS files to SVG format using vanilla JavaScript, HTML, and a Node.js backend. The converter utilizes Ghostscript for converting EPS to PDF and Inkscape for converting PDF to SVG.

## Project Structure

```
/api         # Contains the server-side conversion logic for handling EPS to SVG conversion
/public      # Frontend files, including HTML, CSS, and JS
  ├── index.html   # Main webpage for uploading and downloading converted files
  ├── style.css    # Tailwind CSS for styling the application
  ├── app.js       # JavaScript file for handling client-side logic
/uploads     # Temporary directory for storing uploaded files
server.js    # Node.js server handling the conversion
package.json # Project dependencies and scripts
```

## Features

- Upload EPS files and convert them to SVG format.
- The app utilizes Ghostscript to convert EPS files into PDF and Inkscape to convert PDF into SVG.
- Group SVG elements into paths and text fields, and animate text fields by adding a yellow border.
- Download the converted SVG file after the conversion process completes.
- Supports both local and Vercel deployment.

## Technologies

- **Node.js**: Backend server to handle file uploads and process the conversions.
- **Express**: To manage routing and the file upload mechanism.
- **Multer**: Middleware for handling file uploads.
- **Ghostscript**: To convert EPS files into PDF format.
- **Inkscape**: To convert PDF files into SVG format.
- **Tailwind CSS**: For styling the web interface.
- **Vanilla JavaScript**: For handling the frontend logic.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/raschka.git
   cd raschka
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run watch:dev
   ```

   This will run both the Node.js server and the Tailwind CSS build in watch mode.

4. Navigate to `http://localhost:3000` in your browser.

## Deployment

### Local Deployment

You can run the application locally using Node.js and Inkscape installed on your machine. Use the following command to start the server:

```bash
npm start
```

Make sure you have both **Ghostscript** and **Inkscape** installed locally for the conversion to work.

## License

This project is licensed under the ISC License.