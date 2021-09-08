import Settings from "./scripts/settings";

const apiHostUrl = Settings.songBundlesApiUrl
const apiBaseUrl = `${apiHostUrl}/api/v1`;

const get = (url: string) => fetch(url, {
    method: "GET",
    credentials: 'include',
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const post = (url: string, data: any = "") => fetch(url, {
    method: "POST",
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    // mode: 'no-cors',
    body: JSON.stringify(data)
});

const put = (url: string, data: any = "") => fetch(url, {
    method: "PUT",
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});

const remove = (url: string, data: any = "") => fetch(url, {
    method: "DELETE",
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});

const upload = (url: string, data: FormData) => fetch(url, {
    method: "POST",
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data'
    },
    // mode: 'no-cors',
    body: data
});

// eslint-disable-next-line no-unused-vars
export const throwErrorsIfNotOk = (response: Response) => {
    if (response.status === 404) {
        throw Error(`Could not connect to server (${response.status}): ${response.statusText}`);
    } else if (!response.ok) {
        throw Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response;
}

export const api = {
    songBundles: {
        list: (loadSongs?: boolean, loadVerses?: boolean) =>
            get(`${apiBaseUrl}/songs/bundles?loadSongs=${loadSongs ? "true" : "false"}&loadVerses=${loadVerses ? "true" : "false"}`),
        get: (id: number, loadSongs?: boolean, loadVerses?: boolean) =>
            get(`${apiBaseUrl}/songs/bundles/${id}?loadSongs=${loadSongs ? "true" : "false"}&loadVerses=${loadVerses ? "true" : "false"}`),
        getWithSongs: (id: number, loadVerses?: boolean) =>
            get(`${apiBaseUrl}/songs/bundles/${id}?loadSongs=true&loadVerses=${loadVerses ? "true" : "false"}`),
        search: (query: string, page = 0, page_size = 50,
                 fieldLanguages: Array<string> = [],
                 loadSongs = false, loadVerses = false) =>
            get(`${apiBaseUrl}/songs/bundles?query=${query}&page=${page}&page_size=${page_size}` +
                `&fieldLanguages=${fieldLanguages.join(",")}` +
                `&loadSongs=${loadSongs ? "true" : "false"}` +
                `&loadVerses=${loadVerses ? "true" : "false"}`),
    },
};
