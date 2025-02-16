import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TrackingEntry {
  id?: string;
  date: Date;
  pestName: string;
  location: string;
  affectedPlants: string;
  treatmentPlan: string;
  notes?: string;
}

export const addTrackingEntry = async (entry: Omit<TrackingEntry, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "tracking"), {
      ...entry,
      date: Timestamp.fromDate(entry.date),
      createdAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding tracking entry:", error);
    throw error;
  }
};

export const getTrackingEntries = async (): Promise<TrackingEntry[]> => {
  try {
    const trackingCollection = collection(db, "tracking");
    const q = query(trackingCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      };
    }) as TrackingEntry[];
  } catch (error) {
    console.error("Error getting tracking entries:", error);
    throw error;
  }
};

export const searchTrackingEntries = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, "tracking"),
      where("pestName", ">=", searchTerm),
      where("pestName", "<=", searchTerm + ""),
      orderBy("pestName"),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: new Date(doc.data().date),
    })) as TrackingEntry[];
  } catch (error) {
    console.error("Error searching tracking entries:", error);
    throw error;
  }
};
