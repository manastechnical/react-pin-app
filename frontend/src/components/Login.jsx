import { Room, Cancel } from '@material-ui/icons';
import React,{useState,useRef} from 'react';
import { axiosInstance } from '../config';
import './login.css';

const Login = ({setShowLogin,myStorage,setCurrentUser}) => {
    const [msg,setMsg] = useState("");
    const [error,setError] = useState(false);
    const nameRef = useRef();
    const passRef = useRef();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passRef.current.value
        }

        try {
            const res = await axiosInstance.post('/users/login',user);
            myStorage.setItem('user',res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setMsg(error.response.data)
            setError(true);
        }
    }


  return (
    <div className='loginContainer'>
        <div className='llogo'>
            <Room/> Login
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Enter Username' ref={nameRef} />
            <input type="password" placeholder='Enter Password' ref={passRef}/>
            <button className='login'>Login</button>
            {error && <span className='failure'>{msg}</span>}
        </form>
        <Cancel className='loginCancel' onClick={()=>setShowLogin(false)}/>
    </div>
  );
}

export default Login;
