function checkUrl(url: string) {
    let newUrl = url;
    const lastSegment = newUrl.split("/").pop();
    if (lastSegment === "success") {
        return true;
    } else if (lastSegment === "failed") {
        return false;
    } else {
        return false;
    }
}