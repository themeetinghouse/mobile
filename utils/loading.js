const appendLoaded = (loadResult, stateObj, forceEnd = false) => {
    return { 
        items: stateObj.items.concat(loadResult.items), 
        nextToken: (forceEnd || !loadResult.nextToken) ? "END" : loadResult.nextToken,
        loading: false 
    }
}

export const loadSomeAsync = async (loaderFn, stateObj, setterFn, count = 99999) => {
    if (stateObj.nextToken === "END") return;
    setterFn({...stateObj, loading: true});
    const loadedItems = await loaderFn(count, stateObj.nextToken);
    setterFn(appendLoaded(loadedItems, stateObj, count === 99999 ? true : false));
}