import 'server-only'

import {getApps, initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export function getAdminFirestore() {
  if (getApps().length === 0) {
    const projectId = requireEnv('FIREBASE_PROJECT_ID')
    const clientEmail = requireEnv('FIREBASE_CLIENT_EMAIL')
    const privateKeyRaw = requireEnv('FIREBASE_PRIVATE_KEY')

    const privateKey = privateKeyRaw.replace(/\\n/g, '\n')

    initializeApp({
      credential: cert({projectId, clientEmail, privateKey}),
    })
  }

  return getFirestore()
}
