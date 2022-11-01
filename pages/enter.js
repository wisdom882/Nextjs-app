import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useCallback, useContext, useEffect, useState } from "react";

export default function EnterPage({}) {
    const {user, username} =  useContext(UserContext)
    console.log(user)
    return(
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
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
            console.log('firestroe read execute!')
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