import { auth, firestore, googleAuthProvider } from "../lib/firebase";

export default function EnterPage({}) {
    const user = null;
    const username = null;
    return(
        <main>
            {user ? (!username ? <UsernameForm /> : <SignInButton />) : <SignInButton />}
        </main>
    )
}

//sign in button
function SignInButton(){
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };

    return(
       <button className="btn-google" onClick={signInWithGoogle}>Sign In with Google</button> 
    );
}

//sign out button
function SignOutButton(){
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

//select username
function UsernameForm(){
    
}