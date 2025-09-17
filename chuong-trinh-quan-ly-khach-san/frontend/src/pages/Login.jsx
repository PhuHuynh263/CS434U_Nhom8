import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../store/authSlice";

function Login() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả sử bạn có username và password từ form
    const username = "admin";
    const password = "123456";
    // Kiểm tra đăng nhập (ví dụ đơn giản)
    if (username === "admin" && password === "123456") {
      dispatch(loginSuccess({ username }));
    } else {
      dispatch(loginFailure("Sai tài khoản hoặc mật khẩu"));
    }
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center bg-gray-200">
        <form
          onSubmit={handleLogin}
          className="min-w-96 min-h-[400px] bg-white flex flex-col p-10 border-2 rounded-2xl gap-6"
          action="POST"
        >
          <h1 className="text-center text-3xl font-bold text-[#7B68EE] mb-2">
            Login
          </h1>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label
                className="text-gray-500 font-medium text-[14px] mb-1.5"
                htmlFor="userName"
              >
                User Name
              </label>
              <input
                className="border-1 rounded-md p-2 focus:ring-2"
                type="text"
                id="userName"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-gray-500 font-medium text-[14px] mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="border-1 rounded-md p-2 focus:ring-2"
                type="password"
                id="password"
              />
            </div>
          </div>
          <div className="text-center">
            <button className="bg-[#7B68EE] text-white px-4 py-2 rounded hover:bg-[#7B68EE] transition duration-300">
              Login
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
      ;
    </>
  );
}
export default Login;
