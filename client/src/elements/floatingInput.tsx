import styled from "styled-components";

const InputWrapper = styled.div`
  position: relative;
  & > div {
    position: relative;
  }
  & > div > span {
    position: absolute;
    color: gray;
    top: 50%;
    left: 0;
    padding: 0 5px;
    text-transform: uppercase;
    transform: translateY(-50%);
    margin-left: 10px;
    font-size: 15px;
    background-color: white;
    transition: all 100ms ease-in-out;
    border-radius: 10px;
    pointer-events: none;
  }
  input:focus + span {
    top: 0%;
    font-size: 11px;
    color: #1dabda;
  }

  input:not(:placeholder-shown) + span {
    top: 0%;
    font-size: 11px;
    color: #1dabda;
  }
  input: -webkit-autofill + span {
    top: 0%;
    font-size: 11px;
    color: #1dabda;
  }
`;

const FloatingLabelInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #a6a6a6;
  border-radius: 2px;
  padding: 10px;
`;

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelName: string;
  type: string;
}

const FloatingInput = ({ labelName, type, ...props }: FloatingInputProps) => {
  return (
    <div className={"m-4 w-full"}>
      <InputWrapper>
        <div>
          <FloatingLabelInput
            type={type}
            placeholder=" "
            {...props}
          ></FloatingLabelInput>
          <span>{labelName}</span>
        </div>
      </InputWrapper>
    </div>
  );
};
export default FloatingInput;
