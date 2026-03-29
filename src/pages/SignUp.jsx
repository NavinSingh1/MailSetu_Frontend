import LeftPanel from '../Components/auth/LeftPanel';
import SignupForm from '../Components/auth/SignupForm';
import './Styles/Signup.css';

function SignUp() {
  return (
    <div className="auth-page">
      <LeftPanel mode="signup" />
      <SignupForm />
    </div>
  );
}

export default SignUp;