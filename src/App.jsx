import { useRef, useState } from "react";
import { AnimatedCharacters } from "./components";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CORRECT_PASSWORD = "123456";

function App() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loginState, setLoginState] = useState("idle");
  const submitInFlightRef = useRef(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const isSubmitting = loginState === "submitting";
  const isSuccess = loginState === "success";
  const statusMsg = isSuccess ? "Signed in successfully." : errorMsg;
  const statusType = isSuccess ? "success" : "error";
  const statusId = statusMsg ? "login-status-message" : undefined;
  const submitLabel = isSubmitting ? "Signing in..." : isSuccess ? "Signed In" : "Log In";

  // 提交逻辑是前端演示版：先做本地校验，再模拟一次异步登录结果。
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitInFlightRef.current) return;

    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");
    setLoginState("idle");

    const cleanEmail = email.trim();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setEmailError(true);
      setErrorMsg("Please enter a valid email address.");
      setLoginState("error");
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setErrorMsg("Password must be at least 6 characters.");
      setLoginState("error");
      return;
    }

    submitInFlightRef.current = true;
    setLoginState("submitting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (password === CORRECT_PASSWORD) {
        setLoginState("success");
        return;
      }

      setLoginState("error");
      setPasswordError(true);
      setErrorMsg("Invalid password. Use 123456.");
    } finally {
      submitInFlightRef.current = false;
    }
  };

  return (
    <div id="login-page">
      <div className="left-panel">
        <div className="logo intro-fade-up intro-delay-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L15 9H9L12 2Z" />
            <path d="M12 22L9 15H15L12 22Z" />
            <path d="M2 12L9 9V15L2 12Z" />
            <path d="M22 12L15 15V9L22 12Z" />
          </svg>
          <span>Login</span>
        </div>

        <div className="characters-wrapper intro-characters intro-delay-2">
          <AnimatedCharacters
            isTyping={isTyping}
            isPasswordFocused={isPasswordFocused}
            showPassword={showPassword}
            passwordLength={password.length}
            loginState={loginState}
          />
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <div className="sparkle-icon intro-pop intro-delay-1">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.5 9H10.5L12 2Z" fill="#1a1a2e" />
              <path d="M12 22L10.5 15H13.5L12 22Z" fill="#1a1a2e" />
              <path d="M2 12L9 10.5V13.5L2 12Z" fill="#1a1a2e" />
              <path d="M22 12L15 13.5V10.5L22 12Z" fill="#1a1a2e" />
            </svg>
          </div>

          <div className="form-header intro-fade-up intro-delay-2">
            <h1>Welcome back!</h1>
            <p>Please enter your details</p>
          </div>

          <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
            <div className="form-group intro-fade-up intro-delay-3">
              <label htmlFor="email" className={emailError ? "error-label" : ""}>
                Email
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    // 用户重新编辑内容后，清空上一次提交结果，回到普通交互态。
                    if (!isSubmitting && loginState !== "idle") setLoginState("idle");
                    if (emailError) setEmailError(false);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onFocus={() => {
                    setIsTyping(true);
                    if (loginState !== "idle" && loginState !== "submitting") {
                      setLoginState("idle");
                    }
                  }}
                  onBlur={() => setIsTyping(false)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={emailError ? "error" : ""}
                  aria-invalid={emailError}
                  aria-describedby={statusId}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group intro-fade-up intro-delay-4">
              <label htmlFor="password" className={passwordError ? "error-label" : ""}>
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    // 用户重新编辑内容后，清空上一次提交结果，回到普通交互态。
                    if (!isSubmitting && loginState !== "idle") setLoginState("idle");
                    if (passwordError) setPasswordError(false);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    if (loginState !== "idle" && loginState !== "submitting") {
                      setLoginState("idle");
                    }
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="********"
                  className={passwordError ? "error" : ""}
                  autoComplete="current-password"
                  aria-invalid={passwordError}
                  aria-describedby={statusId}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                    if (!isSubmitting && loginState !== "idle") setLoginState("idle");
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options intro-fade-up intro-delay-5">
              <label className="remember-me">
                <input type="checkbox" defaultChecked /> Remember for 30 days
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <div
              id="login-status-message"
              className={`status-msg intro-fade-up intro-delay-6 ${statusMsg ? "show" : ""} ${statusType}`}
              role={isSuccess ? "status" : "alert"}
              aria-live="polite"
              aria-hidden={!statusMsg}
            >
              {statusMsg || "\u00A0"}
            </div>

            <button
              type="submit"
              className={`btn-login intro-fade-up intro-delay-7 ${isSubmitting ? "is-submitting" : ""} ${isSuccess ? "is-success" : ""} ${loginState === "error" ? "is-error" : ""}`}
              disabled={isSubmitting}
            >
              <span className="btn-text">{submitLabel}</span>
              <div className="btn-hover-content">
                <span>{submitLabel}</span>
                {isSuccess ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </div>
            </button>

            <button type="button" className="btn-google intro-fade-up intro-delay-8">
              <span className="btn-text">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84v-.14z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Log in with Google
              </span>
              <div className="btn-hover-content">
                <span>Log in with Google</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          </form>

          <div className="signup-link intro-fade-up intro-delay-9">正确密码为123456，演示专用</div>
        </div>
      </div>
    </div>
  );
}

export default App;
