import LeftPanel from '../Components/auth/LeftPanel';
import LoginForm from '../Components/auth/LoginForm';
import './Styles/Login.css';

function Login() {
  return (
    <div className="auth-page">
      <LeftPanel mode="login" />
      <LoginForm />
    </div>
  );
}

export default Login;