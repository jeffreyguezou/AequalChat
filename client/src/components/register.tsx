import FloatingInput from "../elements/floatingInput";
import CenterAligner from "../elements/centerAligner";
import HeaderLogo from "../elements/headerLogo";
import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "../hooks/useTheme";
import OtpModal from "./otpModal";

const Register = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [isRPasswordDirty, seIsRPasswordDirty] = useState(false);
  const [showCPError, setShowCPError] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredName(event.currentTarget.value);
  };

  const mailChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredEmail(event.currentTarget.value);
  };
  const passwordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredPassword(event.currentTarget.value);
  };
  const reEnterPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setReEnteredPassword(event.currentTarget.value);
    seIsRPasswordDirty(true);
  };

  let isDark = useTheme();
  let generatedOTP: string;

  const otpGenHandler = async () => {
    const { data } = await axios.post("/auth/generateotp", {
      email: enteredEmail,
    });
    if (data) {
      console.log(data);
      generatedOTP = data.otp;
      setShowOtpModal(true);
    }
  };

  const registerHandler = async (otp: string) => {
    console.log(otp, generatedOTP);
    if (generatedOTP === otp) {
      console.log("otps match");
    }

    /*  const { data } = await axios.post("/auth/register", {
      username: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      preferences: isDark ? "dark" : "light",
    }); */
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
            type="text"
          />
          <FloatingInput
            value={enteredEmail}
            onChange={mailChangeHandler}
            labelName="Email"
            type="email"
          />
          <FloatingInput
            value={enteredPassword}
            onChange={passwordChangeHandler}
            labelName="Password"
            type="password"
          />
          <FloatingInput
            value={reEnteredPassword}
            onChange={reEnterPasswordHandler}
            labelName="Re-enter password"
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
          <span>Already an user? Login Here</span>
        </div>
      </div>
    </CenterAligner>
  );
};
export default Register;
