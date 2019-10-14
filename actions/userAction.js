export const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK';

export const updateBookmark = bookmark => {
    return {
        type: UPDATE_BOOKMARK,
        payload: bookmark,
    }
}