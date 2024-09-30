<template>
    <td-selection-page
        :items="folders"
        :page="page"
        :pageNext="pageNext"
        :pagePrev="pagePrev"
        :onItemClick="onFolderClick"
        :paginate="paginate"
        :emptyStateText="`${$t('folder.noneFound')} ${$t('providers.' + provider + '.displayName')}`">
        {{ $t('folder.select') }} {{ $t(`providers.${provider}.displayName`) }} {{ $t('folder.from') }}
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import folderActions from '@/store/actions/folder.js'; // Use folder actions instead of repository actions
import TdSelectionPage from '@/components/SelectionPage.vue';

export default {
    name: 'DriveAccess',
    components: {
        TdSelectionPage
    },
    computed: mapState({
        provider: (state) => state.provider.selected,
        providerType: (state) => getProviderType(state.provider.selected),
        folders: (state) => state.folder.all, // Using folder data instead of repositories
        page: (state) => state.folder.page,
        pageNext: (state) => state.folder.pageNext,
        pagePrev: (state) => state.folder.pagePrev
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        let page = 1;
        if (this.$route.query.page) {
            page = this.$route.query.page;
        }

        this.$store.dispatch(folderActions.fetch, page);
    },
    methods: {
        onFolderClick(folderId) {
            this.$store.dispatch(folderActions.selected, folderId);
            const params = Object.assign({}, this.$route.params, {
                folder: folderId
            });
            this.$router.push({ name: `${this.providerType}Files`, params, query: this.$route.query }); // Redirect to files page within the folder
        },
        paginate(page) {
            this.$store.dispatch(folderActions.fetch, page); // Paginate folders
        }
    }
};
</script>
