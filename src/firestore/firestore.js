import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
// import { getAuth, signInAnonymously } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

// export const authenticateAnonymously = () => {
//   return signInAnonymously(getAuth(app));
// };

export const getGroceryList = async (groceryListId) => {
  // console.log("getdoc")
  const groceryDocRef = doc(db, "groceryLists", groceryListId);
  // console.log(groceryDocRef)
  return await getDoc(groceryDocRef);
};

export const getDocList = async (groceryLists) => {
  // console.log("getdocs");
  const itemsColRef = collection(db, groceryLists);
  let result = await getDocs(itemsColRef);
  // console.log(result);
  return result;
};

// change this func to getDocList above
// export const getGroceryListItems = async(groceryListId) => {
//   console.log("getdocs")
//   const itemsColRef = collection(db, 'groceryLists', groceryListId, 'items')
//   console.log(itemsColRef)
//     return await getDocs(itemsColRef)
// }
// getGroceryListItems("5ttkOmMvQZ5TfPupgOXb")

export const deleteDocList = async(groceryLists, id) => {
  // console.log("deletedoc")
  // console.log(id)
  const itemsColRef = await deleteDoc(doc(db, groceryLists, id));
  return itemsColRef
}

export const streamGroceryListItems = (groceryListId, snapshot, error) => {
  const itemsColRef = collection(db, "groceryLists", groceryListId, "items");
  const itemsQuery = query(itemsColRef, orderBy("created"));
  return onSnapshot(itemsQuery, snapshot, error);
};

// export const addUserToGroceryList = (userName, groceryListId, userId) => {
//     const groceryDocRef = doc(db, 'groceryLists', groceryListId)
//     return updateDoc(groceryDocRef, {
//             users: arrayUnion({
//                 userId: userId,
//                 name: userName
//             })
//         });
// };

// export const addGroceryListItem = (item, groceryListId, userId) => {
//     return getGroceryListItems(groceryListId)
//         .then(querySnapshot => querySnapshot.docs)
//         .then(groceryListItems => groceryListItems.find(groceryListItem => groceryListItem.data().name.toLowerCase() === item.toLowerCase()))
//         .then( (matchingItem) => {
//             if (!matchingItem) {
//                 const itemsColRef = collection(db, 'groceryLists', groceryListId, 'items')
//                 return addDoc(itemsColRef, {
//                         name: item,
//                         created: serverTimestamp(),
//                         createdBy: userId
//                     });
//             }
//             throw new Error('duplicate-item-error');
//         });
// };
