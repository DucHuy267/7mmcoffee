import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
export default function ProductsPage() {
  return (
    <AdminEntityManager
      endpoint="products"
      title="Sản phẩm"
      description="Tạo, chỉnh sửa hoặc ẩn các món trên menu."
      columns={[
        { key: "nameVi", label: "Tên" },
        { key: "category", label: "Danh mục" },
        { key: "price", label: "Giá" },
        { key: "featured", label: "Nổi bật" },
        { key: "active", label: "Trạng thái" },
      ]}
      fields={[
        { name: "nameVi", label: "Tên tiếng Việt", required: true },
        { name: "nameEn", label: "Tên tiếng Anh", required: true },
        { name: "slug", label: "Slug (để trống để tự tạo)" },
        { name: "category", label: "Danh mục", type: "select", required: true },
        { name: "price", label: "Giá (VND)", type: "number", required: true },
        { name: "originalPrice", label: "Giá gốc", type: "number" },
        { name: "image", label: "Ảnh đại diện", type: "image", required: true },
        { name: "gallery", label: "Gallery ảnh", type: "gallery" },
        { name: "descriptionVi", label: "Mô tả tiếng Việt", type: "textarea" },
        { name: "descriptionEn", label: "Mô tả tiếng Anh", type: "textarea" },
        { name: "displayOrder", label: "Thứ tự", type: "number" },
        { name: "featured", label: "Sản phẩm nổi bật", type: "checkbox" },
        { name: "active", label: "Hiển thị", type: "checkbox" },
      ]}
    />
  );
}
