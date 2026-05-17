"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "antd"; 
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes"; 
import { toast } from "sonner";

interface RegisterForm {
  displayName: string;
  email:       string;
  password:    string;
  confirm:     string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterForm) => {
    setLoading(true);
    try {
      // TODO: Thay thế bằng API call thực tế
      await new Promise((r) => setTimeout(r, 1000));
      
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push(APP_ROUTES.AUTH.LOGIN);
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-8 max-w-md mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1A2332]">Tạo tài khoản</h1>
        <p className="text-gray-500 mt-1">Tham gia JSplit ngay hôm nay</p>
      </div>

      {/* Đã sửa shadow-card thành bóng mờ chuẩn Tailwind */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={<span className="font-semibold text-[#1A2332]">Tên hiển thị</span>}
            name="displayName"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input size="large" className="rounded-2xl bg-[#F8F9FA] border-0 h-12" placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-[#1A2332]">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input size="large" className="rounded-2xl bg-[#F8F9FA] border-0 h-12" placeholder="example@jsplit.com" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-[#1A2332]">Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password size="large" className="rounded-2xl bg-[#F8F9FA] border-0 h-12" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-[#1A2332]">Xác nhận mật khẩu</span>}
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password size="large" className="rounded-2xl bg-[#F8F9FA] border-0 h-12" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            // Đã thêm màu bg-teal-500 để nút bám sát theme
            className="rounded-2xl h-12 font-bold text-base mt-2 bg-teal-500 hover:bg-teal-600"
          >
            Tạo tài khoản
          </Button>
        </Form>

        <p className="text-center text-gray-500 mt-5 text-sm">
          Đã có tài khoản?{" "}
          {/* Sửa link đăng nhập cho đúng, cập nhật màu text-teal-600 */}
          <Link href={APP_ROUTES.AUTH.LOGIN} className="text-teal-600 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}