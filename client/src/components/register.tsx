import FloatingInput from "../elements/floatingInput";
import CenterAligner from "../elements/centerAligner";
import HeaderLogo from "../elements/headerLogo";
import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "../hooks/useTheme";
import OtpModal from "./otpModal";
import { useNavigate } from "react-router";

const Register = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [isRPasswordDirty, seIsRPasswordDirty] = useState(false);
  const [showCPError, setShowCPError] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOTPID, setGeneratedOTPID] = useState("");

  const [isNameError, setisNameError] = useState(true);
  const [isMailError, setisMailError] = useState(true);
  const [isPwError, setisPwError] = useState(true);

  let fetchedOTP: string;

  let navigate = useNavigate();

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredName(event.currentTarget.value);
    setisNameError(true);
  };

  const mailChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredEmail(event.currentTarget.value);
    setisMailError(true);
  };
  const passwordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredPassword(event.currentTarget.value);
    setisPwError(true);
  };
  const reEnterPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setReEnteredPassword(event.currentTarget.value);
    seIsRPasswordDirty(true);
  };

  let isDark = useTheme();

  const otpGenHandler = async () => {
    if (enteredName == "") {
      setisNameError(false);
    } else if (enteredEmail == "") {
      setisMailError(false);
    } else if (enteredPassword == "") {
      setisPwError(false);
    } else if (!isRPasswordDirty) {
    } else {
      const { data } = await axios.post("/auth/generateotp", {
        email: enteredEmail,
      });
      if (data) {
        alert("OTP sent to mail");
        setGeneratedOTPID(data);
        setShowOtpModal(true);
      }
    }
  };

  const fetchSavedOTPHandler = async () => {
    const { data } = await axios.get(`/auth/getOTP/${generatedOTPID}`);
    if (data) {
      fetchedOTP = data.otp;
    }
  };

  const registerHandler = async (otp: string) => {
    await fetchSavedOTPHandler();
    if (fetchedOTP == otp) {
      const { data } = await axios.post("/auth/register", {
        username: enteredName,
        email: enteredEmail,
        password: enteredPassword,
        profile:
          "https://res.cloudinary.com/dn8vdf49h/image/upload/v1710222554/istockphoto-1223671392-612x612_eya1jk.jpg",
        preferences: isDark ? "dark" : "light",
        bio: "Hello there, General Kenobi",
        friends: [],
        requests: [],
        sentRequests: [],
        unreadMessages: [],
      });

      if (data) {
        alert("user created. Please Login and enjoy");
        navigate("/login");
      }
    } else {
      alert("Invalid OTP");
    }
  };

  useEffect(() => {
    if (isRPasswordDirty) {
      if (enteredPassword === reEnteredPassword) {
        setShowCPError(false);
      } else {
        setShowCPError(true);
      }
    }
  }, [reEnteredPassword]);

  return (
    <CenterAligner>
      {showOtpModal && (
        <OtpModal
          onRegister={(otp) => {
            registerHandler(otp);
          }}
        ></OtpModal>
      )}
      <HeaderLogo />
      <div className="w-2/3">
        <div className="mx-2 my-3">
          <FloatingInput
            value={enteredName}
            onChange={nameChangeHandler}
            labelName="User Name"
            error={(!isNameError).toString()}
            type="text"
          />

          <FloatingInput
            value={enteredEmail}
            onChange={mailChangeHandler}
            labelName="Email"
            error={(!isMailError).toString()}
            type="email"
          />

          <FloatingInput
            value={enteredPassword}
            onChange={passwordChangeHandler}
            labelName="Password"
            error={(!isPwError).toString()}
            type="password"
          />
          <FloatingInput
            value={reEnteredPassword}
            onChange={reEnterPasswordHandler}
            labelName="Re-enter password"
            error={(isRPasswordDirty && showCPError).toString()}
            type="password"
          />
          {showCPError && isRPasswordDirty ? (
            <div className="text-red-500 ml-4 -mt-4">
              Passwords no not match
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="mx-2 my-3 text-center flex flex-col items-center">
          <button
            onClick={otpGenHandler}
            className="bg-slate-400 p-2 rounded-lg w-full sm:w-1/2 md:w-1/4 hover:rounded-full hover:bg-blue-400 hover:font-bold text-white text-bold"
          >
            Generate OTP
          </button>
          <span>
            Already an user?{" "}
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>{" "}
            Here
          </span>
        </div>
      </div>
    </CenterAligner>
  );
};
export default Register;
