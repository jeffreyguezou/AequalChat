type OtpModalProp = {
  onRegister: (otp: string) => void;
};

const OtpModal = ({ onRegister }: OtpModalProp) => {
  const moveToNext = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event);
    if (
      event.currentTarget.value.length === 1 &&
      event.currentTarget.nextElementSibling
    ) {
      event.currentTarget.nextElementSibling.focus();
    }
    if (
      event.key === "Backspace" &&
      event.currentTarget.previousElementSibling
    ) {
      event.currentTarget.previousElementSibling.focus();
    }
  };

  const registerClickHandler = () => {
    let otp1: HTMLInputElement = document.querySelector(
      "#otp1"
    ) as HTMLInputElement;
    let otp2: HTMLInputElement = document.querySelector(
      "#otp2"
    ) as HTMLInputElement;
    let otp3: HTMLInputElement = document.querySelector(
      "#otp3"
    ) as HTMLInputElement;
    let otp4: HTMLInputElement = document.querySelector(
      "#otp4"
    ) as HTMLInputElement;
    if (otp1 && otp2 && otp3 && otp4) {
      let enteredOtp = otp1.value + otp2.value + otp3.value + otp4.value;
      onRegister(enteredOtp);
    }
  };

  return (
    <dialog
      className="z-[100] w-1/2 items-center flex flex-col border border-blue-500 rounded-lg p-6"
      open
    >
      <header className="text-center font-extrabold text-blue-400">
        Verify email
      </header>
      <div className="flex gap-2">
        <input
          id="otp1"
          className="w-8 h-8 md:w-12 md:wd-12 lg:w-32 lg:h-32 border border-solid border-blue-200 text-2xl text-center"
          maxLength={1}
          onKeyUp={moveToNext}
          type="text"
          autoFocus
        ></input>
        <input
          id="otp2"
          className="w-8 h-8 md:w-12 md:wd-12 lg:w-32 lg:h-32 border border-solid border-blue-200 text-2xl text-center"
          maxLength={1}
          onKeyUp={moveToNext}
          type="text"
        ></input>
        <input
          id="otp3"
          className="w-8 h-8 md:w-12 md:wd-12 lg:w-32 lg:h-32 border border-solid border-blue-200 text-2xl text-center"
          maxLength={1}
          onKeyUp={moveToNext}
          type="text"
        ></input>
        <input
          id="otp4"
          className="w-8 h-8 md:w-12 md:wd-12 lg:w-32 lg:h-32 border border-solid border-blue-200 text-2xl text-center"
          maxLength={1}
          onKeyUp={moveToNext}
          type="text"
        ></input>
      </div>
      <div className="p-2">
        <button
          onClick={registerClickHandler}
          className="border border-blue-300 hover:bg-blue-50 hover:font-semibold p-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </dialog>
  );
};
export default OtpModal;
