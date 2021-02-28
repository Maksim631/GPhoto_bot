import axios from 'axios'
import config from '../config.js'

const googleUrl = 'https://photoslibrary.googleapis.com/v1'
const filePathUrlTemplate =
  'https://api.telegram.org/bot<token>/getFile?file_id=<file_id>'
const photoUrlTemplate = 'https://api.telegram.org/file/bot<token>/<file_path>'

async function getFileBytes(fileId, token) {
  const filePathUrl = filePathUrlTemplate
    .replace('<token>', token)
    .replace('<file_id>', fileId)
  const { data } = await axios.get(filePathUrl)
  const photoUrl = photoUrlTemplate
    .replace('<token>', token)
    .replace('<file_path>', data.result.file_path)
  return await axios.get(photoUrl, { responseType: 'arraybuffer' })
}

async function uploadBytes(binaryData, token) {
  return axios.post(`${googleUrl}/uploads`, binaryData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/octet-stream',
      'X-Goog-Upload-Content-Type': 'image/png',
      'X-Goog-Upload-Protocol': 'raw',
    },
  })
}

async function createMedia(uploadToken, token) {
  return axios.post(
    `${googleUrl}/mediaItems:batchCreate`,
    {
      newMediaItems: [
        {
          simpleMediaItem: {
            fileName: 'filename',
            uploadToken: uploadToken,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    },
  )
}

export default async function uploadMedia(fileId, accessToken, chatId) {
  try {
    const { data: mediaBytes } = await getFileBytes(fileId, config.tgToken)
    const { data: inputBytes } = await uploadBytes(mediaBytes, accessToken)
    const result = await createMedia(inputBytes, accessToken)
    console.log(
      `uploadMedia on chatId: ${chatId}. Create media result: `,
      result,
    )
    return true
  } catch (e) {
    console.error(`uploadMedia on chatId: ${chatId}. Error accured:`, e)
    return false
  }
}
