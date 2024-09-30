import Vue from 'vue';
import {
    FOLDER_CLEAR,
    FOLDER_FETCH,
    FOLDER_SELECTED
} from '../actions/folder.js';
import threatmodelApi from '../../service/api/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.page = 1;
    state.pageNext = false;
    state.pagePrev = false;
};

const state = {
    all: [],
    selected: '',
    page: 1,
    pageNext: false,
    pagePrev: false
};

const actions = {
    [FOLDER_CLEAR]: ({ commit }) => commit(FOLDER_CLEAR),
    [FOLDER_FETCH]: async ({ commit, dispatch }, page = 1) => {
        dispatch(FOLDER_CLEAR);
        const resp = await threatmodelApi.folderAsync(page);
        commit(FOLDER_FETCH, { 
            'folders': resp.data.folders,
            'page': resp.data.pagination.page,
            'pageNext': resp.data.pagination.next,
            'pagePrev': resp.data.pagination.prev
        });
    },
    [FOLDER_SELECTED]: ({ commit }, folder) => commit(FOLDER_SELECTED, folder)
};

const mutations = {
    [FOLDER_CLEAR]: (state) => clearState(state),
    [FOLDER_FETCH]: (state, { folders, page, pageNext, pagePrev }) => {
        state.all.length = 0;
        folders.forEach((folder, idx) => Vue.set(state.all, idx, folder));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
    },
    [FOLDER_SELECTED]: (state, folder) => {
        state.selected = folder;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
