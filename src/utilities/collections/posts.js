import constants from '../string_constants/global.js';
import postsConstants from '../string_constants/posts.js';

export const postsFiltersProc = new Map();
export const postsDMLs = new Map();

postsFiltersProc
.set(constants.GENERAL_VIEW, postsConstants.GET_POSTS)
.set(constants.TAG_NAME, postsConstants.GET_POST_BY_TAG_NAME)

postsDMLs
.set(constants.INSERT, postsConstants.INSERT_POST)
.set(constants.UPDATE, postsConstants.UPDATE_POST)
.set(constants.DELETE, postsConstants.DELETE_POST)
