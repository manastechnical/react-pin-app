import { Room, Cancel } from '@material-ui/icons';
import React,{useState,useRef} from 'react';
import { axiosInstance } from '../config';
import './register.css';

const Register = ({setShowRegister}) => {

    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const [msg,setMsg] = useState("");
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value
        }

        try {
            await axiosInstance.post('/users/register',newUser);
            setError(false);
            setSuccess(true);
            setMsg("Registeration Successful. Now you can login");
        } catch (error) {
            setMsg(error.response.data);
            setError(true);
        }
    }


  return (
    <div className='registerContainer'>
        <div className='logo'>
            <Room/> Register
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Enter Username' ref={nameRef} />
            <input type="email" placeholder='Enter Email' ref={emailRef}/>
            <input type="password" placeholder='Enter Password' ref={passRef}/>
            <button className='register'>Register</button>
            {success && <span className='success'>{msg}</span>}
            {error && <span className='failure'>{msg}</span>}
        </form>
        <Cancel className='registerCancel' onClick={()=>setShowRegister(false)}/>
    </div>
  );
}

export default Register;
