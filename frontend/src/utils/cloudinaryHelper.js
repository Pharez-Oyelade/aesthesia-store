export const getOptimizedUrl = (url, width = "auto") => {
  if (!url) return "";

  // Define transformation string
  // f_auto best format, q_auto: best compression, w_: specific width

  const transformations = `f_auto,q_auto,w_${width}`;

  // insert transformations immediately after uploads
  return url.replace("/upload/", `/upload/${transformations}/`);
};
