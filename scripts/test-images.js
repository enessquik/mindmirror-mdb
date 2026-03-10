// Test script to check if TMDB images are accessible
const testUrls = [
  'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', // Inception
  'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Dark Knight  
  'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', // Breaking Bad
  'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', // Stranger Things
];

async function testImages() {
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${url.split('/').pop()}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`${url}: Error - ${error.message}`);
    }
  }
}

testImages();
