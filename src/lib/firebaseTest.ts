import { db, auth } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

async function testConnection() {
  try {
    // Only test if user is signed in or we want a public check
    // Here we just test if firestore is reachable
    await getDocFromServer(doc(db, 'system', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Please check your Firebase configuration or connectivity.");
    }
  }
}

testConnection();
