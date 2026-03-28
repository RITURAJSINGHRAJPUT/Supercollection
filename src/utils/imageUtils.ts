// Data URI for a guaranteed fallback image that requires no network request
export const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22%23f8fafc%22%2F%3E%3Cpath%20d%3D%22M300%20220c-44.11%200-80%2035.89-80%2080s35.89%2080%2080%2080%2080-35.89%2080-80-35.89-80-80-80zm0%20140c-33.09%200-60-26.91-60-60s26.91-60%2060-60%2060%2026.91%2060%2060-26.91%2060-60%2060z%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22system-ui,%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%2224%22%20fill%3D%22%2394a3b8%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

export const getDriveImageUrl = (url: string | null | undefined): string => {
  if (!url) return FALLBACK_IMAGE;
  
  // Extract ID from any Google Drive link
  let id = '';
  
  if (url.includes('drive.google.com/uc?id=')) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) id = match[1];
  } 
  else if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) id = match[1];
  }
  else if (url.includes('drive.google.com/open?id=')) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) id = match[1];
  }

  if (id) {
    // lh3.googleusercontent.com is much more reliable for image embedding 
    // without running into Google's third-party cookie or CORS blocks.
    return `https://lh3.googleusercontent.com/d/${id}=s1000`;
  }

  return url;
};
