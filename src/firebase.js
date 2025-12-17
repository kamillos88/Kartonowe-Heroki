import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2bCKgLkEn9LcpsZCSPP2Gq2-0cAIWuAg",
  authDomain: "kartonowe-heroki.firebaseapp.com",
  projectId: "kartonowe-heroki",
  storageBucket: "kartonowe-heroki.firebasestorage.app",
  messagingSenderId: "1019536662068",
  appId: "1:1019536662068:web:1b66a91fddbe9b1a88b461"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funkcja zapisująca głos
export const saveVoteToFirebase = async (voteId, votesData) => {
  try {
    await addDoc(collection(db, 'votes'), {
      voteId: voteId,
      votes: votesData,
      timestamp: new Date().toISOString(),
    });
    console.log('Głos zapisany w Firebase!');
    return true;
  } catch (error) {
    console.error('Błąd Firebase:', error);
    return false;
  }
};

// Funkcja pobierająca wszystkie głosy (dla admina)
export const getAllVotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'votes'));
    const votes = [];
    querySnapshot.forEach((doc) => {
      votes.push({ id: doc.id, ...doc.data() });
    });
    return votes;
  } catch (error) {
    console.error('Błąd pobierania:', error);
    return [];
  }
};