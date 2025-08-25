import { Button, Divider, Form, Input, message } from "antd";
import { ILogin } from "@/types/auth";
import { Link, useNavigate } from "react-router-dom";
import api from "@/config/axios.customize";

const Login = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: ILogin) => {
    try {
      const res = await api.post("/login", values);
      const { token, user } = res.data || {};

      if (!token || !user) {
        messageApi.error("Không nhận được thông tin đăng nhập từ server");
        return;
      }

      // Chỉ cho phép admin
      if (user.role !== "admin") {
        messageApi.error("Chỉ tài khoản Admin mới được phép đăng nhập!");
        return;
      }

      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      messageApi.success("Đăng nhập thành công!");
      nav("/");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Đăng nhập thất bại!";
      messageApi.error(errMsg);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e0f2fe, #f3f4f6)",
          padding: 20,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            padding: 40,
            maxWidth: 600,
            width: "100%",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 32,
              fontSize: 28,
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            ĐĂNG NHẬP TÀI KHOẢN
          </h2>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Email không hợp lệ!" },
                { required: true, message: "Vui lòng nhập email!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", fontWeight: 500 }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div style={{ textAlign: "center" }}>
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" style={{ color: "#006a94" }}>
              Đăng ký
            </Link>{" "}
            ngay
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
