export const withBasePath = (path: string): string => {
  const basePath = import.meta.env.BASE_URL;
  if (!path || path.startsWith(basePath)) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
};