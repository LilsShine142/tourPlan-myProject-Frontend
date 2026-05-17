"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Divider } from "antd"; // Đã bỏ App của antd
import {
  GoogleOutlined,
  AppleOutlined,
  TableOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes"; 
import { toast } from "sonner"; // Sử dụng Sonner cho thông báo

interface LoginForm {
  email:    string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // TODO: Thay thế bằng API call thực tế
      await new Promise((r) => setTimeout(r, 1000));
      
      toast.success("Đăng nhập thành công!");
      router.push(APP_ROUTES.MAIN.DASHBOARD); // Đã sửa lại đúng route
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-8 max-w-md mx-auto w-full">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-[2rem] font-extrabold text-[#1A2332] leading-tight mb-2">
          Quản lý chi tiêu
          <br />
          &amp; lên kế hoạch{" "}
          <span className="text-teal-600">cùng</span>
          <br />
          <span className="text-teal-600">bạn bè</span>
        </h1>

        {/* Feature cards */}
        <div className="flex gap-3 mt-6">
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-3">
              <TableOutlined className="text-teal-600 text-xl" />
            </div>
            <p className="font-semibold text-[#1A2332] text-sm leading-snug">
              Chia bill
              <br />
              nhanh gọn
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 translate-y-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <CompassOutlined className="text-blue-500 text-xl" />
            </div>
            <p className="font-semibold text-[#1A2332] text-sm leading-snug">
              Lên kế hoạch
              <br />
              du lịch dễ dàng
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
        {/* Social login */}
        <div className="flex gap-3 mb-5">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="flex-1 rounded-2xl font-medium border-gray-200"
          >
            Google
          </Button>
          <Button
            icon={<AppleOutlined />}
            size="large"
            className="flex-1 rounded-2xl font-medium border-gray-200"
          >
            Apple
          </Button>
        </div>

        <Divider className="text-gray-700 text-sm">Hoặc đăng nhập bằng email</Divider>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={<span className="font-semibold text-[#1A2332]">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="example@jsplit.com"
              size="large"
              className="rounded-2xl bg-[#F8F9FA] border-0 h-12"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex justify-items-end w-full items-center">
                <span className="font-semibold text-[#1A2332]">Mật khẩu</span>
                <Link href="#" className="text-teal-600 text-sm font-medium">
                  Quên?
                </Link>
              </div>
            }
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              size="large"
              className="rounded-2xl bg-[#F8F9FA] border-0 h-12"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className="rounded-2xl h-12 font-bold text-base mt-2 bg-teal-500 hover:bg-teal-600"
          >
            Đăng nhập
          </Button>
        </Form>

        <p className="text-center text-gray-500 mt-5 text-sm">
          Chưa có tài khoản?{" "}
          {/* Đã sửa lại đường dẫn theo APP_ROUTES */}
          <Link href={APP_ROUTES.AUTH.REGISTER} className="text-teal-600 font-semibold">
            Tham gia ngay
          </Link>
        </p>
      </div>
    </div>
  );
}