import multiparty from 'multiparty'
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from 'fs';

export default async function handel(req, res) {
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  const map = files.files[0]



  console.log(map)
  const links = [];

  const storageRef = ref(storage, `images/${map.originalFilename}`)
  const pat = fs.readFileSync(map.path)
  await uploadBytes(storageRef, pat).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      const uploadlink = downloadURL
      links.push(uploadlink)
      return res.json({links})
    });
  })




}

export const config = {
  api: { bodyParser: false },
}