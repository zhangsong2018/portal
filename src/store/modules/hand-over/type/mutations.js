import type from './muations-type'
export default {
    [type.USER_INFO](state, payload) {
        state.handInfo = payload;
    }
}