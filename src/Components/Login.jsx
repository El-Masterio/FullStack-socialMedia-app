import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { jwtDecode } from 'jwt-decode';
import { client } from '../client';
import { homeUrl } from '../utils/data';
const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const decoded = jwtDecode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded));

    const { name, picture, sub } = decoded;

    const user = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(user).then(() => {
      navigate(`${homeUrl}`, { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen ">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover "
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-4 ">
            <img src={logo} width="170px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with Google
                </button>
              )}
              cookiePolicy="single_host_origin"
              onSuccess={responseGoogle}
              onError={(response) => console.log('error', response)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
