import { UPDATE_BOOKMARK } from '../actions/userAction';
import lodash from 'lodash';

const initialState = {
    user: {

    },
    bookmark: [],
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BOOKMARK:
            let bookmarkState = { ...state };
            bookmarkState.bookmark = action.payload; //更新して返す（マージしちゃダメ）
            return bookmarkState;
        default:
            return state;
    }
}

export default user;