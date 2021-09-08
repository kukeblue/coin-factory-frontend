export function getImageNameFromUrl(url: string) {
    const imageSplit = url.split('/')
    return imageSplit[imageSplit.length - 1]
}
