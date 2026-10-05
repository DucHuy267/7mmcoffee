import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
export default function CategoriesPage() {
  return (
    <AdminEntityManager
      endpoint="categories"
      title="Danh mục"
      description="Nhóm món ăn và thức uống hiển thị ở thực đơn."
      columns={[
        { key: "nameVi", label: "Tên (VI)" },
        { key: "nameEn", label: "Tên (EN)" },
        { key: "slug", label: "Slug" },
        { key: "active", label: "Trạng thái" },
      ]}
      fields={[
        { name: "nameVi", label: "Tên tiếng Việt", required: true },
        { name: "nameEn", label: "Tên tiếng Anh", required: true },
        { name: "slug", label: "Slug (để trống để tự tạo)" },
        { name: "displayOrder", label: "Thứ tự", type: "number" },
        { name: "descriptionVi", label: "Mô tả tiếng Việt", type: "textarea" },
        { name: "descriptionEn", label: "Mô tả tiếng Anh", type: "textarea" },
        { name: "image", label: "Ảnh danh mục", type: "image" },
        { name: "active", label: "Hiển thị", type: "checkbox" },
      ]}
    />
  );
}
