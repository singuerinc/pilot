export const headers = credentials => {
  return {
    headers: { common: { Authorization: `Basic ${credentials}` } }
  };
};
