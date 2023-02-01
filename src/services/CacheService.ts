import * as FileSystem from 'expo-file-system';

export default function CacheService() {
  const clearCache = async () => {
    try {
      const cacheFolder = FileSystem.cacheDirectory;
      if (!cacheFolder) return;
      const cacheDirectory = await FileSystem.getInfoAsync(cacheFolder);
      if (!cacheDirectory.exists) {
        await FileSystem.makeDirectoryAsync(cacheFolder);
      }
      const cachedFiles = await FileSystem.readDirectoryAsync(`${cacheFolder}`);
      const cachedFilesInfo = await Promise.all(
        cachedFiles.map(async (file) => {
          const fileInfo = await FileSystem.getInfoAsync(
            `${cacheFolder}${file}`
          );
          return fileInfo;
        })
      );
      const sortedExcludingFonts = cachedFilesInfo
        .filter(
          (file) => !file.uri.includes('ttf') && !file.uri.includes('otf')
        )
        .sort((a, b) => {
          if (a?.modificationTime && b?.modificationTime)
            return b.modificationTime - a.modificationTime;
          return 0;
        });
      let maximumIndex = 0;
      let totalSize = 0;
      for (
        let fileIndex = 0;
        fileIndex < sortedExcludingFonts.length;
        fileIndex++
      ) {
        if (sortedExcludingFonts?.[fileIndex]?.size) {
          totalSize += sortedExcludingFonts?.[fileIndex]?.size ?? 0;
        }
        if (totalSize > 80000000) {
          console.log({ fileIndex });
          maximumIndex = fileIndex;
          break;
        }
      }
      // console.log('cached Item count ', sortedExcludingFonts?.length);
      if (maximumIndex === 0) return;
      const filesToDelete = sortedExcludingFonts.slice(maximumIndex);
      for (let fileIndex = 0; fileIndex < filesToDelete.length; fileIndex++) {
        const file = filesToDelete[fileIndex];
        if (file?.uri) {
          FileSystem.deleteAsync(file.uri);
        }
      }
    } catch (error) {
      // console.error('Error while clearing cache', { error });
    }
  };
  return { clearCache };
}
