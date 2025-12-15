const axios = require('axios');

const createItemImageFileClient = (token) => {
  const client = axios.create({
    baseURL: process.env.IMAGE_SERVICE_URL,
    timeout: 15000,
    // headers: {
    //   Authorization: token ? `Bearer ${token}` : undefined,
    //   'X-Service-Name': 'item-service'
    // }
  });

  client.interceptors.request.use((config) => {
    config.headers['X-Service-Name'] = 'item-service';

    // Ambil token dari parameter
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('[item-imageFileClient]', {
        method: error.config?.method,
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );

  return client;
};

module.exports = createItemImageFileClient;



// const axios = require('axios');

// const itemImageFileClient = axios.create({
//   baseURL: process.env.IMAGE_SERVICE_URL,
//   timeout: 5000,
// });

// /**
//  * REQUEST INTERCEPTOR
//  * - Inject service identity
//  * - Inject auth token antar service
//  */
// itemImageFileClient.interceptors.request.use(
//   (config) => {
//     config.headers['X-Service-Name'] = 'item-service'; // identitas service pemanggil
//     if (process.env.SERVICE_TOKEN) {
//       config.headers.Authorization = `Bearer ${process.env.SERVICE_TOKEN}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /**
//  * RESPONSE INTERCEPTOR
//  * - Centralized error logging
//  */
// itemImageFileClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('[item-imageFileClient]', { // ubah label agar jelas dari service mana
//       method: error.config?.method,
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.message,
//     });
//     return Promise.reject(error);
//   }
// );


// module.exports = itemImageFileClient;
