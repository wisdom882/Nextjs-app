import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useCallback, useContext, useEffect, useState } from "react";

import debounce from 'lodash.debounce';

export default function EnterPage(props) {
    const {user, username} =  useContext(UserContext)
    //user signed out <SignInButton/>
    //user signed in, but missing username <UsernameForm />
    //user signed in, has username <SignOutButton/>
    return(
        <main>
            {user ? (!username ? <UsernameForm /> : <SignOutButton />) : <SignInButton />}
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
    const [formValue, setFormvalue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username} = useContext(UserContext)

    useEffect(() => {
        checkUsername(formValue)
    },[formValue])

    const onSubmit = async (e) => {
        e.preventDefault();

        //create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        //commit both docs togther as a batch write.
        const batch = firestore.batch();
        batch.set(userDoc, {username: formValue, photoURL: user.phtoURL, displayName: user.displayName});
        batch.set(usernameDoc, {uid: user.uid});

        await batch.commit();
    }

    const onChange = (e) => {
        // force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(val.length < 3){
            setFormvalue(val)
            setLoading(false)
            setIsValid(false)
        }

        
        if(re.test(val)){
            setFormvalue(val)
            setLoading(false)
            setIsValid(false)
        }
    };

    //hit the database for username match after each debounced change
    // usecallback is required for debounce to work
    const checkUsername = useCallback(debounce(async (username) => {
        if(username.length >= 3){
            const ref = firestore.doc(`usernames/${username}`)
            const {exists} = await ref.get();
            console.log('firestroe read executed!')
            setIsValid(!exists)
            setLoading(false)
        }
        }, 500), [])
    
    return(
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange}/>

                    <button type="submit" className="btn-green" disabled={!isValid}>Choose</button>
                </form>

                <h3>Debug state</h3>
                <div>
                    Username:{formValue}
                    <br/>
                    Loading: {loading.toString()}
                    <br/>
                    Username Valid:{isValid.toString()}
                </div>
            </section>
        )

    );
}