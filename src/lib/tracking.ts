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

const mockEntries: TrackingEntry[] = [
  {
    id: "1",
    date: new Date("2024-03-15"),
    pestName: "Aphids",
    location: "Vegetable Garden",
    affectedPlants: "Tomatoes, Peppers",
    treatmentPlan: "Neem oil spray applied",
  },
  {
    id: "2",
    date: new Date("2024-03-10"),
    pestName: "Japanese Beetles",
    location: "Rose Garden",
    affectedPlants: "Rose bushes",
    treatmentPlan: "Hand picking and organic pesticide",
  },
];

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
    // Return a mock ID in case of error
    return `mock-${Date.now()}`;
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
    // Return mock data in case of error
    return mockEntries;
  }
};

export const searchTrackingEntries = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, "tracking"),
      where("pestName", ">=", searchTerm),
      where("pestName", "<=", searchTerm + "\uf8ff"),
      orderBy("pestName"),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as TrackingEntry[];
  } catch (error) {
    console.error("Error searching tracking entries:", error);
    // Filter mock data in case of error
    return mockEntries.filter((entry) =>
      entry.pestName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
};
