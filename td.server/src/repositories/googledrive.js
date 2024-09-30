import { google } from 'googleapis';
import env from '../env/Env.js';

// Initialize the Google Drive client
const getClient = (accessToken) => {
    const oauth2Client = new google.auth.OAuth2(env.get().config.GOOGLE_CLIENT_ID, env.get().config.GOOGLE_CLIENT_SECRET, env.get().config.GOOGLE_REDIRECT_URI);
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
};

// List folders in the user's drive (equivalent to reposAsync for GitHub)
const listFoldersAsync = async (pageToken, accessToken) => {
    const auth = getClient(accessToken);
    
    const driveClient = google.drive({ version: 'v2', auth });

    const res = driveClient.files.list({
        fields: 'kind, nextPageToken, incompleteSearch, files(id, name)',
        pageSize: 10,
        prettyPrint: true,
        includeTeamDriveItems: false
    });

    return {
        folders: res.data.files,
        nextPageToken: res.data.nextPageToken,
    };
};

// Get folder details (similar to branchesAsync)
const getFolderDetailsAsync = async (folderId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType',
    });

    return res.data;
};

// List files in a folder (equivalent to modelsAsync for GitHub)
const listFilesInFolderAsync = async (folderId, pageToken, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.list({
        q: `'${folderId}' in parents`,
        fields: 'nextPageToken, files(id, name, mimeType)',
        pageToken: pageToken,
        pageSize: 10, // Customize page size if needed
    });

    return {
        files: res.data.files,
        nextPageToken: res.data.nextPageToken,
    };
};

// Get file content (similar to modelAsync)
const getFileContentAsync = async (fileId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: fileId,
        alt: 'media',
    });

    return res.data;
};

// Create a new file in a folder (equivalent to createAsync)
const createFileInFolderAsync = async (folderId, fileName, fileContent, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: fileName,
        parents: [folderId],
    };

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  '),
    };

    const res = await driveClient.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    return res.data;
};

// Update a file (similar to updateAsync)
const updateFileAsync = async (fileId, fileContent, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  '),
    };

    const res = await driveClient.files.update({
        fileId: fileId,
        media: media,
        fields: 'id',
    });

    return res.data;
};

// Delete a file (equivalent to deleteAsync)
const deleteFileAsync = async (fileId, accessToken) => {
    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    await driveClient.files.delete({
        fileId: fileId,
    });

    return { success: true };
};

export default {
    listFoldersAsync,
    getFolderDetailsAsync,
    listFilesInFolderAsync,
    getFileContentAsync,
    createFileInFolderAsync,
    updateFileAsync,
    deleteFileAsync,
};
