document.getElementById('upload-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const fileInput = document.getElementById('eps-file');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select an EPS file.');
    return;
  }

  const formData = new FormData();
  formData.append('epsFile', file);

  // Detect if the app is running locally or on Vercel
  const apiUrl = window.location.hostname.includes('localhost') 
    ? '/convert' // Local endpoint
    : '/api/convert'; // Vercel endpoint

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      const svgContent = result.svgContent;

      document.getElementById('download-link').style.display = 'flex';

      // Parse the SVG content and display element IDs
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      
      // Get lists of text and path elements
      const textElements = Array.from(svgDoc.querySelectorAll('text'));
      const pathElements = Array.from(svgDoc.querySelectorAll('path'));

      // Get the UL elements to append IDs
      const textList = document.getElementById('text-list');
      const pathsList = document.getElementById('paths-list');

      // Clear the current lists
      textList.innerHTML = '';
      pathsList.innerHTML = '';

      // Append the text element IDs to the #text-list UL
      textElements.forEach(el => {
        const listItem = document.createElement('li');
        listItem.textContent = el.id || '(No ID)';
        listItem.classList.add('text-slate-500', 'text-sm');
        textList.appendChild(listItem);
      });

      // Append the path element IDs to the #paths-list UL
      pathElements.forEach(el => {
        const listItem = document.createElement('li');
        listItem.textContent = el.id || '(No ID)';
        listItem.classList.add('text-slate-500', 'text-sm');
        pathsList.appendChild(listItem);
      });

      // Animate each text element by adding a yellow border
      textElements.forEach(el => {
        el.style.stroke = 'yellow';
        el.style.strokeWidth = '2';
      });

      // Create a new Blob to allow download of the modified SVG
      const updatedSvg = new XMLSerializer().serializeToString(svgDoc.documentElement);
      const blob = new Blob([updatedSvg], { type: 'image/svg+xml' });
      const downloadUrl = URL.createObjectURL(blob);

      // Show download link
      const downloadLink = document.getElementById('svg-download');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'converted.svg';
    } else {
      alert('Conversion failed.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Failed to connect to the server.');
  }
});
