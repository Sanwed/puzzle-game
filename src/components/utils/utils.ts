export const shuffleArr = (array: unknown[]) => {
  array.sort(() => Math.random() - 0.5);
};
