//CONSTANTS
import postsConstants from '../string_constants/posts.js';
//COLLECTIONS
import {postsFiltersProc, postsDMLs } from './posts.js';

export const dmlStoredProc = new Map();
export const filterStoredProc = new Map();

//TABLE NAME + FILTER STORED PROC
filterStoredProc.set(postsConstants.TABLE_NAME, postsFiltersProc);
//TABLE NAME + DMLS NAMES MAP
dmlStoredProc.set(postsConstants.TABLE_NAME, postsDMLs);
