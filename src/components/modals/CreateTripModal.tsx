// "use client";

// import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
// import { EnvironmentOutlined, AlignLeftOutlined } from "@ant-design/icons";

// const { RangePicker } = DatePicker;

// interface CreateTripModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export function CreateTripModal({ open, onClose }: CreateTripModalProps) {
//   const [form] = Form.useForm();

//   const handleSubmit = async (values: any) => {
//     try {
//       console.log("Dữ liệu chuyến đi mới:", values);
//       // Gọi API tạo chuyến đi ở đây
//       // await createTripApi(values);
      
//       message.success("Tạo chuyến đi thành công!");
//       form.resetFields();
//       onClose();
//     } catch (error) {
//       message.error("Có lỗi xảy ra khi tạo chuyến đi.");
//     }
//   };

//   const handleCancel = () => {
//     form.resetFields();
//     onClose();
//   };

//   return (
//     <Modal
//       title={<span className="text-xl font-bold text-gray-800">Tạo hành trình mới ✈️</span>}
//       open={open}
//       onCancel={handleCancel}
//       footer={null}
//       centered
//       className="custom-modal"
//       classNames={{
//         body: "pt-4",
//         header: "mb-5",
//       }}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         initialValues={{ currency: "VND" }}
//         className="space-y-4"
//       >
//         <Form.Item
//           name="name"
//           label={<span className="font-semibold text-gray-700">Tên chuyến đi</span>}
//           rules={[{ required: true, message: "Vui lòng nhập tên chuyến đi!" }]}
//         >
//           <Input
//             prefix={<EnvironmentOutlined className="text-gray-400 mr-2" />}
//             placeholder="Ví dụ: Đà Lạt 3 ngày 2 đêm..."
//             size="large"
//             className="rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white"
//           />
//         </Form.Item>

//         <Form.Item
//           name="dates"
//           label={<span className="font-semibold text-gray-700">Thời gian</span>}
//           rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
//         >
//           <RangePicker
//             size="large"
//             className="w-full rounded-xl bg-gray-50/50 hover:bg-white"
//             format="DD/MM/YYYY"
//             placeholder={['Ngày đi', 'Ngày về']}
//             inputReadOnly={true} // Chống bật bàn phím trên điện thoại
//             popupClassName="
//               max-md:!left-[50%] max-md:-translate-x-1/2 max-md:!max-w-[95vw]
//               max-md:[&_.ant-picker-panels]:flex-col
//               max-md:[&_.ant-picker-panel-container]:overflow-y-auto
//               max-md:[&_.ant-picker-panel-container]:max-h-[60vh]
//             "
//           />
//         </Form.Item>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Form.Item
//             name="currency"
//             label={<span className="font-semibold text-gray-700">Loại tiền tệ</span>}
//             rules={[{ required: true }]}
//             className="mb-0 sm:mb-6"
//           >
//             <Select
//               size="large"
//               className="rounded-xl"
//               options={[
//                 { value: "VND", label: "VNĐ (₫)" },
//                 { value: "USD", label: "USD ($)" },
//                 { value: "JPY", label: "Yên (¥)" },
//               ]}
//             />
//           </Form.Item>

//           <Form.Item
//             name="description"
//             label={<span className="font-semibold text-gray-700">Mô tả ngắn</span>}
//             className="mb-0 sm:mb-6"
//           >
//             <Input
//               prefix={<AlignLeftOutlined className="text-gray-400 mr-2" />}
//               placeholder="Có thể bỏ qua..."
//               size="large"
//               className="rounded-xl bg-gray-50/50"
//             />
//           </Form.Item>
//         </div>

//         <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6 sm:mt-2">
//           <Button
//             size="large"
//             className="flex-1 rounded-xl font-semibold border-gray-200 text-gray-600 hover:text-gray-900"
//             onClick={handleCancel}
//           >
//             Hủy
//           </Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             className="flex-1 rounded-xl font-semibold bg-teal-600 hover:bg-teal-500 shadow-sm border-0"
//           >
//             Bắt đầu lên lịch
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// }
"use client";

import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import { EnvironmentOutlined, AlignLeftOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTripModal({ open, onClose }: CreateTripModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      console.log("Dữ liệu chuyến đi mới:", values);
      message.success("Tạo chuyến đi thành công!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo chuyến đi.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={<span className="text-xl font-bold text-gray-800">Tạo hành trình mới ✈️</span>}
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      className="custom-modal"
      classNames={{
        // Form bên trong Modal vẫn có thể cuộn bình thường nếu bị dài
        body: "pt-4 max-h-[75vh] overflow-y-auto overscroll-contain",
        header: "mb-5",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ currency: "VND" }}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-700">Tên chuyến đi</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên chuyến đi!" }]}
        >
          <Input
            prefix={<EnvironmentOutlined className="text-gray-400 mr-2" />}
            placeholder="Ví dụ: Đà Lạt 3 ngày 2 đêm..."
            size="large"
            className="rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white"
          />
        </Form.Item>

        <Form.Item
          name="dates"
          label={<span className="font-semibold text-gray-700">Thời gian</span>}
          rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
        >
          <RangePicker
            size="large"
            className="w-full rounded-xl bg-gray-50/50 hover:bg-white"
            format="DD/MM/YYYY"
            placeholder={['Ngày đi', 'Ngày về']}
            inputReadOnly={true}
            // Kéo DOM của lịch vào bên trong Modal để tránh bị khóa cảm ứng (touch block)
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement} 
            popupClassName="
              max-md:!fixed max-md:!top-1/2 max-md:!left-1/2 max-md:!-translate-x-1/2 max-md:!-translate-y-1/2 max-md:!w-[92vw] max-md:!z-[9999]
              max-md:[&_.ant-picker-panel-container]:!w-full
              max-md:[&_.ant-picker-panel-layout]:!flex-col
              max-md:[&_.ant-picker-panels]:!flex-col 
              max-md:[&_.ant-picker-panels]:!flex-nowrap
              max-md:[&_.ant-picker-panels]:!overflow-y-auto 
              max-md:[&_.ant-picker-panels]:!max-h-[60vh]
              max-md:[&_.ant-picker-panels]:!overscroll-contain
            "
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="currency"
            label={<span className="font-semibold text-gray-700">Loại tiền tệ</span>}
            rules={[{ required: true }]}
            className="mb-0 sm:mb-6"
          >
            <Select
              size="large"
              className="rounded-xl"
              options={[
                { value: "VND", label: "VNĐ (₫)" },
                { value: "USD", label: "USD ($)" },
                { value: "JPY", label: "Yên (¥)" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Mô tả ngắn</span>}
            className="mb-0 sm:mb-6"
          >
            <Input
              prefix={<AlignLeftOutlined className="text-gray-400 mr-2" />}
              placeholder="Có thể bỏ qua..."
              size="large"
              className="rounded-xl bg-gray-50/50"
            />
          </Form.Item>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6 sm:mt-2">
          <Button
            size="large"
            className="flex-1 rounded-xl font-semibold border-gray-200 text-gray-600 hover:text-gray-900"
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="flex-1 rounded-xl font-semibold bg-teal-600 hover:bg-teal-500 shadow-sm border-0"
          >
            Bắt đầu lên lịch
          </Button>
        </div>
      </Form>
    </Modal>
  );
}