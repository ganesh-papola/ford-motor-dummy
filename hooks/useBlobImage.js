import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const useBlobImage = (src) => {
  const [url, setImageBlobUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        new URL(src);
        const headers = {
          Authorization: `Bearer ${Cookies.get('ADFS-credential')}`,
        };
        const img = await fetch(src, { headers });
        const imageData = await img.blob();
        const blobUrl = URL.createObjectURL(imageData);
        setImageBlobUrl(blobUrl);
      } catch {
        setImageBlobUrl(src);
      }
    };
    loadImage();
  }, [src]);

  return url;
};
