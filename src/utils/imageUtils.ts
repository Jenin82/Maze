import imageCompression from 'browser-image-compression';

export const convertToWebP = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('The file given is not an image');
  }

  console.log('File details:', file); // Debugging: Log file details

  const options = {
    maxSizeMB: 0.5, // Set the maximum size to 0.5MB (500KB)
    maxWidthOrHeight: 800, // Max width/height
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/webp', // Specify the file type to be WebP
    initialQuality: 0.7, // Set initial quality (0 to 1)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error during image conversion:', error);
    throw error;
  }
};