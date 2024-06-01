export const createStorageId = () => {
  if (!localStorage.getItem("storage-id")) {
    localStorage.setItem(
      "storage-id",
      `f${(~~(Math.random() * 1e8)).toString(16)}`,
    );
  }

  return localStorage.getItem("storage-id");
};

export const shuffleArr = (array: unknown[]) => {
  array.sort(() => Math.random() - 0.5);
};
