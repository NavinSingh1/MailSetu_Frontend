import LeftPanel from '../Components/MailSetuSignUp/LeftPanel';
import SignupForm from '../Components/MailSetuSignUp/SignupForm';
import "../MailSetuSignUp/Styles/index.css";

export default function MailSetuSignup() {
  return (
    <div className="auth-page">
      <LeftPanel />
      <SignupForm />
    </div>
  );
}