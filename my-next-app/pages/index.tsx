import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import styles from '../styles/Home.module.css'; // Assuming this exists

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div className={styles.container}>
      <Head>
        <title>NextAuth.js Example</title>
        <meta name="description" content="NextAuth.js example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          NextAuth.js Google Login Example
        </h1>

        {!session && (
          <>
            <p>Not signed in</p>
            <button onClick={() => signIn('google')}>Sign in with Google</button>
          </>
        )}
        {session && session.user && ( // Added null check for session.user
          <>
            <p>Signed in as {session.user.email}</p>
            {session.user.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name ? `${session.user.name}'s avatar` : 'User avatar'} // Added null check for session.user.name
                style={{ width: '50px', borderRadius: '50%' }} 
              />
            )}
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        {loading && <p>Loading...</p>}
      </main>
    </div>
  );
}
