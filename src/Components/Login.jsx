import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import shareVideo from '../assets/share.mp4';
import logoWhite from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const decoded = jwtDecode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded));

    const { name, picture, sub } = decoded;

    client
      .createIfNotExists({
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
      })
      .then(() => navigate('/', { replace: true }));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0d0c0b]">
      <video
        src={shareVideo}
        type="video/mp4"
        loop
        controls={false}
        muted
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Layered scrim: a flat overlay washed the footage out, this keeps
          contrast at the centre while letting the corners breathe. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <img
          src={logoWhite}
          width="190"
          alt=""
          className="animate-rise"
        />

        <h1
          className="animate-rise mt-8 max-w-md text-center font-display text-3xl
                     leading-tight text-white md:text-[2.6rem]"
          style={{ animationDelay: '80ms' }}
        >
          Collect what moves you.
        </h1>

        <p
          className="animate-rise mt-3 max-w-sm text-center text-sm leading-relaxed
                     text-white/65"
          style={{ animationDelay: '150ms' }}
        >
          Save photographs, build collections and share the frames worth
          keeping.
        </p>

        <div
          className="animate-rise mt-9 overflow-hidden rounded-pill shadow-hover"
          style={{ animationDelay: '220ms' }}
        >
          {/* @react-oauth/google renders its own button. The previous code
              passed `render` and `cookiePolicy`, which belong to the old
              react-google-login package and were silently ignored. */}
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => console.log('Google login failed')}
            shape="pill"
            size="large"
            text="continue_with"
            width="280"
          />
        </div>

        <p
          className="animate-rise mt-8 text-[0.7rem] uppercase tracking-[0.2em] text-white/35"
          style={{ animationDelay: '300ms' }}
        >
          Picture Perfect
        </p>
      </div>
    </div>
  );
};

export default Login;
