import LeftPanel from '../Components/auth/LeftPanel';
import ForgotPasswordForm from '../Components/auth/ForgotPasswordForm';
import './Styles/ForgotPassword.css';

function ForgotPassword() {
  return (
    <div className="forgot-password-page">
      <LeftPanel mode="login" />
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPassword;