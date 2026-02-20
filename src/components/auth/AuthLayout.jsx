import { useLocation, Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <div className="auth-page">
      <div className={`auth-container ${isRegister ? "right-panel-active" : ""}`}>
        
        {/* LEFT – LOGIN FORM */}
        <div className="form-container sign-in-container">
          {!isRegister && children}
        </div>

        {/* RIGHT – REGISTER FORM */}
        <div className="form-container sign-up-container">
          {isRegister && children}
        </div>

        {/* SLIDING OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* LEFT OVERLAY */}
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>Already have an account?</p>
              <Link to="/login" className="ghost-btn">SIGN IN</Link>
            </div>

            {/* RIGHT OVERLAY */}
            <div className="overlay-panel overlay-right">
              <h2>Welcome To Talk-A-Tive!</h2>
              <p>New here?</p>
              <Link to="/register" className="ghost-btn">SIGN UP</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;