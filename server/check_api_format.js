
const axios = require('axios');

async function checkContents() {
  try {
    const response = await axios.get('http://localhost:3000/api/contents');
    const firstItem = response.data[0];
    console.log('First item:', firstItem);
    console.log('Genres type:', typeof firstItem.genres);
    console.log('Streaming type:', typeof firstItem.streaming);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkContents();
