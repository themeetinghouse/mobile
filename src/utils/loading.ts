const appendLoaded = (
  loadResult: any,
  stateObj: any,
  forceEnd = false
): any => {
  return {
    items: stateObj.items.concat(loadResult.items),
    nextToken: forceEnd || !loadResult.nextToken ? 'END' : loadResult.nextToken,
    loading: false,
  };
};

export const loadSomeAsync = async (
  loaderFn: (count: number, nextToken?: any) => Promise<any>,
  stateObj: any,
  setterFn: (data: any) => any,
  count = 99999
): Promise<void> => {
  if (stateObj.nextToken === 'END') return;
  setterFn({ ...stateObj, loading: true });
  const loadedItems = await loaderFn(count, stateObj.nextToken);
  setterFn(appendLoaded(loadedItems, stateObj, count === 99999 ? true : false));
};
