import { BookOpenText, Coffee, Mail, Tags } from "lucide-react";
import { getDashboardStats } from "@/lib/content";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    {
      label: "Tổng sản phẩm",
      value: stats.products,
      detail: `${stats.activeProducts} đang hiển thị`,
      icon: Coffee,
    },
    {
      label: "Danh mục",
      value: stats.categories,
      detail: "Tổ chức thực đơn",
      icon: Tags,
    },
    {
      label: "Bài viết",
      value: stats.stories,
      detail: `${stats.publishedStories} đã xuất bản`,
      icon: BookOpenText,
    },
    {
      label: "Tin nhắn",
      value: stats.messages,
      detail: "Từ form liên hệ",
      icon: Mail,
    },
  ];
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-coffee">
        CMS
      </p>
      <h1 className="mt-3 font-display text-5xl text-espresso">Tổng quan</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Chào mừng trở lại. Đây là nhịp hoạt động của 7mmcoffee.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon size={18} className="text-coffee" />
            </div>
            <p className="mt-7 font-display text-5xl text-espresso">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border bg-[#e8ded0] p-6 sm:p-8">
        <h2 className="font-display text-3xl text-espresso">
          Nội dung dẫn dắt trải nghiệm.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Dùng menu bên trái để cập nhật món, các câu chuyện và thông tin hiển
          thị trên website. Các thay đổi đã lưu sẽ phản ánh ở website công khai.
        </p>
      </section>
    </div>
  );
}
