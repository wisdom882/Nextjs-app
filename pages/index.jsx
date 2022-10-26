
import toast, {Toaster} from 'react-hot-toast'
import Loader from '../components/Loader'

export default function Home() {
  return (
    <div>
     <Loader show />
     <button onClick={() => toast.success('Toast me!')}>Toast Me!</button>
    </div>
  )
}
