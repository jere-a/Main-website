import fetchInject from 'fetch-inject';

function fetchjs() {
    if (!window.fetch) return;
    fetchInject([
        'https://cdn.jsdelivr.net/combine/npm/validator@13,npm/moment@2,npm/timeago.js@4'
    ])
}
fetchjs();