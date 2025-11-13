import React, { useState, useEffect } from "react";

const ForgotPasswordWithOtp = () => {
  const [step, setStep] = useState("email"); // email -> otp -> resetDone
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // resend timer state
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const sendOtp = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/V1/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setIsOtpSent(true);
        setSecondsLeft(60); // disable resend for 60s
        setMessage("OTP sent to your email. Check inbox (or spam).");
      } else {
        setMessage(data.message || "Could not send OTP.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Try again.");
    }
  };

  const resendOtp = async () => {
    if (secondsLeft > 0) return;
    setOtp("");
    await sendOtp();
  };

  const verifyOtp = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!otp) {
      setMessage("Please enter OTP.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/V1/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setOtpVerified(true);
        setMessage("OTP verified. You can now set a new password.");
      } else {
        setMessage(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while verifying OTP.");
    }
  };

  const resetPassword = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!password || !confirm) {
      setMessage("Please fill both password fields.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/V1/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful. You can now login.");
        setStep("done");
      } else {
        setMessage(data.message || "Could not reset password.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while resetting password.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Forgot Password (OTP)</h2>

      {step === "email" && (
        <form onSubmit={sendOtp} style={styles.form}>
          <input
            type="email"
            placeholder="Your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Send OTP
          </button>
        </form>
      )}

      {isOtpSent && (
        <div style={styles.card}>
          <p>
            <strong>OTP sent to:</strong> {email}
          </p>

          {!otpVerified ? (
            <>
              <form onSubmit={verifyOtp} style={styles.form}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>
                  Verify OTP
                </button>
              </form>

              <div style={{ marginTop: 8 }}>
                <button
                  onClick={resendOtp}
                  disabled={secondsLeft > 0}
                  style={{
                    ...styles.linkBtn,
                    opacity: secondsLeft > 0 ? 0.6 : 1,
                  }}
                >
                  {secondsLeft > 0
                    ? `Resend OTP (${secondsLeft}s)`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={resetPassword} style={styles.form}>
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>
                  Set New Password
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {step === "done" && (
        <div style={styles.card}>
          <p>
            Password changed successfully. <a href="/login">Login</a>
          </p>
        </div>
      )}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 420,
    margin: "24px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #ddd",

  },
  button: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "none",
    background: "#0b79d0",
    color: "white",
    cursor: "pointer",
  },
  card: {
    marginTop: 12,
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 10,
  },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#0b79d0",
    cursor: "pointer",
  },
  message: { marginTop: 12, color: "#333" },
};

export default ForgotPasswordWithOtp;
