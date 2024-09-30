import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.google;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/drive/folder`,
        key: 'openExisting',
        icon: 'google-drive',
        iconPreface: 'fab'
    },
    {
        to: `/${providerType}/drive/folder?action=create`,
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/demo/select',
        key: 'readDemo',
        icon: 'cloud-download-alt'
    }
]);

export default {
    getDashboardActions
};
