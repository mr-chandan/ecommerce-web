import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDzfmlSbrin2xL7jyMhboohFlL2-DExGUo",
    authDomain: "fruitsinmug.firebaseapp.com",
    projectId: "fruitsinmug",
    storageBucket: "fruitsinmug.appspot.com",
    messagingSenderId: "483523562273",
    appId: "1:483523562273:web:f99cd514796839ad830c60",
    measurementId: "G-PDKLCMQLW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app