import {
  EyeOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import "./SignUpForm.css";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/AuthService";
import useAuth from "../../../hooks/useAuth";

const USER_REGEX = /^[a-z]+\.([a-z]+\d*)@[a-z]+\.utm\.md$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

const SignUpForm = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd || !validMatch) {
      setErrMsg("Invalid Entry");
      return;
    }

    setIsLoading(true);

    try {
      const authData = await authService.register(
        user,
        pwd,
        matchPwd,
        setAuth
      );

      setUser("");
      setPwd("");
      setMatchPwd("");
      navigate("/order", { replace: true });
    } catch (err) {
      setErrMsg(err.message);
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form onSubmit={handleSubmit}>
        <label className="signup-label poppins-regular" htmlFor="email">
          Email Address:{" "}
          <span className={validName ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validName || !user ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input
          type="email"
          size="large"
          placeholder="Email Address"
          prefix={<UserOutlined />}
          className="signup-input"
          id="email"
          required
          ref={userRef}
          onChange={(e) => setUser(e.target.value)}
          value={user}
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          autoComplete="off"
          disabled={isLoading}
        />
        <p
          id="uidnote"
          className={
            userFocus && user && !validName ? "instructions" : "offscreen"
          }
          style={{ marginLeft: 0, textAlign: "left" }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
          &nbsp; Email should be in the format: <br />
          <code>username.lastname@domain.utm.md</code>
        </p>

        <label className="signup-label poppins-regular" htmlFor="password">
          Password:
          <span className={validPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          iconRender={(visible) =>
            visible ? <EyeOutlined /> : <EyeOutlined />
          }
          className="signup-input"
          id="password"
          required
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          autoComplete="off"
          disabled={isLoading}
        />
        <p
          id="pwdnote"
          className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
          &nbsp; Password must include at least 8 characters, 1 uppercase
          letter, 1 lowercase letter, 1 number, and 1 special character.
        </p>

        <label
          className="signup-label poppins-regular"
          htmlFor="confirm-password"
        >
          Confirm Password:
          <span className={validMatch && matchPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <Input.Password
          size="large"
          placeholder="Confirm Password"
          prefix={<LockOutlined />}
          iconRender={(visible) =>
            visible ? <EyeOutlined /> : <EyeOutlined />
          }
          className="signup-input"
          autoComplete="off"
          id="confirm-password"
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          disabled={isLoading}
        />
        <p
          id="confirmnote"
          className={matchFocus && !validMatch ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#3678eb" }} />
          &nbsp; Passwords must match.
        </p>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          className="signup-button"
          icon={<UserAddOutlined className="create-account-icon-signup" />}
          disabled={!validName || !validPwd || !validMatch}
          loading={isLoading}
        >
          Sign Up
        </Button>
      </form>

      <Divider className="poppins-regular">Are you an existing user?</Divider>
      <Button
        block
        size="large"
        icon={<UserOutlined className="account-icon-signup" />}
        onClick={() => navigate("/login")}
        disabled={isLoading}
      >
        Log In
      </Button>
    </>
  );
};

export default SignUpForm;
