export const isMatchUrlEndpoint = (pathname: string, endpoint: string) => {
  if (pathname) {
    if (pathname.match(endpoint)) {
      return true;
    }
  }

  return false;
};
