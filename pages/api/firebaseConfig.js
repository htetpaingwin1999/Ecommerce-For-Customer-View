import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
    apiKey: "AIzaSyBueAOMH63X8ntNL0mg_5YKPSB5UEVH3fk",
    authDomain: "otpecommerce-39049.firebaseapp.com",
    projectId: "otpecommerce-39049",
    storageBucket: "otpecommerce-39049.appspot.com",
    messagingSenderId: "755556184341",
    appId: "1:755556184341:web:2db1d419f184991037f91c",
    measurementId: "G-CS9CWN48W7"
};  

let app = null;
let analytics = null;

if (typeof window !== 'undefined') {
  // Check if the code is running on the client-side (browser)
  // Initialize Firebase app and analytics (if available)
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

export { app, analytics };
