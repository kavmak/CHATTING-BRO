import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from 'react-router-dom';

const Form = ({
  isSignInPage = true,
}) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: ''
    }),
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('data :>> ', data);
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.status === 400) {
      alert('Invalid credentials');
    } else {
      const resData = await res.json();
      if (resData.token) {
        localStorage.setItem('user:token', resData.token);
        localStorage.setItem('user:detail', JSON.stringify(resData.user));
        navigate('/');
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#FFD700] via-[#A0C8E0] to-[#00FF00] h-screen flex items-center justify-center">
      <div className="bg-white w-[600px] h-[600px] transform hover:scale-105 transition-transform shadow-xl rounded-xl p-8 flex flex-col justify-center items-center"
           style={{
             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), inset 0px 0px 4px rgba(0, 0, 0, 0.2)',
           }}>

        <div className="text-4xl font-extrabold text-[#333333]">
          Welcome {isSignInPage && 'Back'}
        </div>

        <div className="text-xl font-light mb-14">{isSignInPage ? 'Sign in to explore' : 'Sign up to get started'}</div>

        <form className="flex flex-col items-center w-full" onSubmit={(e) => handleSubmit(e)}>
          {!isSignInPage && (
            <Input
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6 w-[75%]"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}

          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="mb-6 w-[75%]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="mb-14 w-[75%]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <Button label={isSignInPage ? 'Sign in' : 'Sign up'} type='submit' className="w-[75%] bg-[#FFD700] text-white hover:bg-[#FFC500]" />
        </form>

        <div>{isSignInPage ? "Don't have an account?" : "Already have an account?"} <span className="text-[#007BFF] cursor-pointer font-bold transition duration-300 hover:text-[#0056b3]" onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>{isSignInPage ? 'Sign up' : 'Sign in'}</span></div>
      </div>
    </div>
  );
}

export default Form;
