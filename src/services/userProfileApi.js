import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const USERS_COLLECTION = 'users';
const AVATAR_VARIATIONS = 8;

export const getUserProfileRef = (userId) =>
  doc(db, USERS_COLLECTION, userId);

export async function ensureUserProfileDocument(firebaseUser) {
  if (!firebaseUser?.uid) return null;

  const userRef = getUserProfileRef(firebaseUser.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) {
    const data = existing.data();
    const updates = {};
    if (typeof data.avatarIndex !== 'number') {
      updates.avatarIndex = Math.floor(Math.random() * AVATAR_VARIATIONS);
    }
    if (!data.nickname && firebaseUser.displayName) {
      updates.nickname = firebaseUser.displayName;
    }
    if (!data.displayName && firebaseUser.displayName) {
      updates.displayName = firebaseUser.displayName;
    }
    if (!data.email && firebaseUser.email) {
      updates.email = firebaseUser.email;
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await setDoc(userRef, updates, { merge: true });
      return { ...data, ...updates };
    }
    return data;
  }

  const fallbackName =
    firebaseUser.displayName ||
    firebaseUser.email?.split('@')?.[0] ||
    `creator-${firebaseUser.uid.slice(0, 5)}`;

  const payload = {
    uid: firebaseUser.uid,
    displayName: fallbackName,
    nickname: fallbackName,
    email: firebaseUser.email || '',
    avatarIndex: Math.floor(Math.random() * AVATAR_VARIATIONS),
    photoURL: firebaseUser.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, payload, { merge: true });
  return payload;
}

export function subscribeToUserProfile(userId, { onUpdate, onError } = {}) {
  if (!userId) {
    onUpdate?.(null);
    return () => {};
  }

  const userRef = getUserProfileRef(userId);
  return onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate?.(null);
        return;
      }
      onUpdate?.({ id: snapshot.id, ...snapshot.data() });
    },
    (error) => {
      console.warn('[userProfileApi] subscribe error', error);
      onError?.(error);
    }
  );
}

export async function updateUserAvatarColor(userId, color) {
  if (!userId || !color) return;
  const userRef = getUserProfileRef(userId);
  await setDoc(
    userRef,
    {
      avatarColor: color,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

const userProfileApi = {
  getUserProfileRef,
  ensureUserProfileDocument,
  subscribeToUserProfile,
  updateUserAvatarColor,
};

export default userProfileApi;
