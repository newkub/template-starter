export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const hello = (name: string): string => {
  return `Hello, ${capitalize(name)}!`;
};
