import PNG from 'png-js';
import JPEG from './jpeg';
const request = require('request');

function getImage(body, extension) {
  try {
    return new JPEG(body);
  } catch (err) {
    try {
      return new PNG(body);
    } catch (err) {
      throw new Error('Image data incorrect');
    }
  }
}

export const fetchImage = src => {
  if (typeof src === 'object') {
    if (src.data && src.format) {
      // Local file given
      return new Promise((resolve, reject) =>
        resolve(getImage(src.data, src.format)),
      );
    }
    throw new Error(
      `Invalid data given for local file: ${JSON.stringify(src)}`,
    );
  }

  const extension = src.split('.').pop();
  return new Promise((resolve, reject) => {
    request(
      {
        url: src,
        method: 'GET',
        encoding: null,
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }

        const image = getImage(body, extension);
        return resolve(image);
      },
    );
  });
};
