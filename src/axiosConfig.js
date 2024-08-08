import axios from 'axios';

axios.defaults.baseURL = process.env.TASSADAPI_BASE_URL;

const token = localStorage.getItem('apiToken');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('/api/auth')
        .then((response) => {
            if (response.status !== 200) {
                console.log('ici');
                localStorage.removeItem('apiToken');
                axios.defaults.headers.common['Authorization'] = '';
                throw new Error('Invalid token');
            }
        })
        .catch((error) => {
            localStorage.removeItem('apiToken');
            axios.defaults.headers.common['Authorization'] = '';
        });
    axios.get('/api/auth/reserved').then((response) => {
        if (response.status === 200) {
            localStorage.setItem('subscribed', 'true');
        } else {
            localStorage.setItem('subscribed', 'false');
        }
    }).catch((error) => {
        localStorage.setItem('subscribed', 'false');
    });
}

export default axios;
