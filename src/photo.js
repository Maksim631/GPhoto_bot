import axios from 'axios';

const googleUrl = 'https://photoslibrary.googleapis.com/v1';
const filePathUrlTemplate = 'https://api.telegram.org/bot<token>/getFile?file_id=<file_id>'
const photoUrlTemplate = 'https://api.telegram.org/file/bot<token>/<file_path>'

export async function getFileBytes(fileId, token) {
    const filePathUrl = filePathUrlTemplate.replace('<token>', token).replace('<file_id>', fileId);
    const { data } = await axios.get(filePathUrl);
    const photoUrl = photoUrlTemplate.replace('<token>', token).replace('<file_path>', data.result.file_path);
    return await axios.get(photoUrl, { responseType: 'arraybuffer' });
}

export async function uploadBytes(binaryData, token) {
    return axios.post(`${googleUrl}/uploads`, binaryData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/octet-stream',
            'X-Goog-Upload-Content-Type': 'image/png',
            'X-Goog-Upload-Protocol': 'raw'
        }
    })
}

export async function createMedia(uploadToken, token) {
    return axios.post(`${googleUrl}/mediaItems:batchCreate`, {
        "newMediaItems": [
            {
                "description": "item-description",
                "simpleMediaItem": {
                    "fileName": "filename",
                    "uploadToken": uploadToken
                }
            }
        ]
    },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        }
    )
}

