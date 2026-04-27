const normalizeSingleImage = (image) => {
  if (!image) return null;

  if (typeof image === "string") {
    return {
      url: image,
      publicId: null,
    };
  }

  if (typeof image === "object" && image.url) {
    return {
      url: image.url,
      publicId: image.publicId || null,
    };
  }

  return null;
};

export const normalizeMessageImage = (image) => {
  if (!image) return null;

  if (Array.isArray(image)) {
    const normalizedImages = image
      .map(normalizeSingleImage)
      .filter(Boolean)
      .slice(0, 5);

    return normalizedImages.length ? normalizedImages : null;
  }

  return normalizeSingleImage(image);
};
