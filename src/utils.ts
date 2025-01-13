export function makeImagePath(id: string, format: string = "original") {
  return `https://image.tmdb.org/t/p/${format}${id}`;
}
