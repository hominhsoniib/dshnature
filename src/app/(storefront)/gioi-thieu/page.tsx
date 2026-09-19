import React from "react";
import type { Metadata } from "next";
import { Award, BadgeCheck, CheckCircle2, FlaskConical, HeartHandshake, Leaf, ShieldCheck, Target, Users } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";

export const metadata: Metadata = {
  title: "Giới thiệu DSH NATURE | Đồng hành cùng sức khỏe gia đình",
  description:
    "Tìm hiểu về Công ty Cổ phần DSH Nature — sứ mệnh, tầm nhìn, 5 giá trị cốt lõi và tiêu chuẩn chất lượng sản phẩm chăm sóc sức khỏe gia đình Việt.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 py-8 md:gap-16 md:py-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-primary-light/50 to-cream px-4 py-12 text-center md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            CÔNG TY CỔ PHẦN DSH NATURE
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Đồng hành cùng sức khỏe gia đình
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            DSH Nature cam kết mang đến những giải pháp chăm sóc sức khỏe an toàn, chất lượng cao và phù hợp nhất với thể trạng của mỗi gia đình Việt Nam.
          </p>
        </div>
      </section>

      {/* 01. Tổng quan DSH Nature */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Về chúng tôi</span>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Thương hiệu chăm sóc sức khỏe thiên nhiên hàng đầu
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Công ty Cổ phần DSH Nature được thành lập với mục tiêu nâng cao chất lượng cuộc sống cho cộng đồng thông qua các sản phẩm có nguồn gốc thiên nhiên kết hợp nghiên cứu khoa học hiện đại.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Mỗi sản phẩm của DSH Nature là kết tinh từ nguồn thảo dược chọn lọc, quy trình sản xuất đạt chuẩn y tế khắt khe và tấm lòng tận tâm vì sức khỏe của người tiêu dùng.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4 bg-white shadow-soft">
                <p className="font-heading text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Nguồn gốc thiên nhiên chọn lọc</p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-white shadow-soft">
                <p className="font-heading text-2xl font-bold text-primary">GMP</p>
                <p className="text-xs text-muted-foreground">Tiêu chuẩn sản xuất quốc tế</p>
              </div>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl bg-primary-light/60 flex items-center justify-center p-8 text-center shadow-soft">
            <div className="space-y-3">
              <Leaf className="mx-auto size-16 text-primary" />
              <p className="font-heading text-xl font-bold text-primary">DSH NATURE</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Chất lượng - An toàn - Khoa học - Uy tín - Bền vững
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Sứ mệnh & Tầm nhìn */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Định hướng chiến lược"
            title="Sứ mệnh & Tầm nhìn"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6 md:p-8 shadow-soft">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                <HeartHandshake className="size-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Sứ mệnh</h3>
              <p className="leading-relaxed text-muted-foreground">
                Đồng hành cùng sức khỏe mọi gia đình Việt Nam bằng những giải pháp hỗ trợ chăm sóc sức khỏe an toàn, tinh khiết từ tự nhiên và đáng tin cậy. DSH Nature không ngừng lắng nghe và thấu hiểu nhu cầu của từng thành viên trong gia đình.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 md:p-8 shadow-soft">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Target className="size-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Tầm nhìn</h3>
              <p className="leading-relaxed text-muted-foreground">
                Trở thành biểu tượng uy tín trong ngành thảo dược chăm sóc sức khỏe tại Việt Nam, mở rộng quy mô hệ thống phân phối đại lý rộng khắp cả nước và vươn tầm khu vực trong tương lai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03. 5 Giá trị cốt lõi */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Trụ cột thương hiệu"
          title="5 Giá trị cốt lõi"
          description="Những giá trị định hình mọi hoạt động và sản phẩm của DSH Nature."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: "Chất lượng",
              icon: BadgeCheck,
              desc: "Nguồn nguyên liệu đầu vào tinh sạch, quy trình kiểm định nghiêm ngặt từ khâu thu hái đến thành phẩm.",
            },
            {
              title: "An toàn",
              icon: ShieldCheck,
              desc: "Đảm bảo các tiêu chuẩn an toàn thực phẩm, tuân thủ đúng quy định pháp luật và bộ Y tế.",
            },
            {
              title: "Khoa học",
              icon: FlaskConical,
              desc: "Kế thừa bài thuốc thảo dược kết hợp cùng các công trình nghiên cứu khoa học hiện đại.",
            },
            {
              title: "Uy tín",
              icon: Award,
              desc: "Luôn giữ vững cam kết về nguồn gốc, công bố minh bạch và tận tụy tư vấn cho khách hàng.",
            },
            {
              title: "Bền vững",
              icon: Leaf,
              desc: "Hướng đến phát triển bền vững cùng môi trường, đồng hành dài lâu cùng sức khỏe cộng đồng.",
            },
          ].map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-xl border border-border p-6 bg-white shadow-soft transition-all hover:shadow-soft-hover">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Icon className="size-5" />
                </div>
                <h4 className="font-heading font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04. Tiêu chuẩn & Chứng nhận */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Cam kết chất lượng"
            title="Tiêu chuẩn & Chứng nhận"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-soft border border-border">
              <CheckCircle2 className="size-6 shrink-0 text-primary mt-1" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Chuẩn ISO & GMP</h4>
                <p className="text-xs text-muted-foreground">
                  Hệ thống nhà máy đối tác đạt chuẩn GMP Bộ Y tế và tiêu chuẩn quản lý chất lượng ISO.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-soft border border-border">
              <CheckCircle2 className="size-6 shrink-0 text-primary mt-1" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Minh bạch hồ sơ</h4>
                <p className="text-xs text-muted-foreground">
                  Tất cả sản phẩm đều được cấp giấy xác nhận công bố phù hợp quy định an toàn thực phẩm.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-soft border border-border">
              <CheckCircle2 className="size-6 shrink-0 text-primary mt-1" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Tư vấn chuyên môn</h4>
                <p className="text-xs text-muted-foreground">
                  Đội ngũ dược sĩ chuyên môn đồng hành giải đáp thắc mắc sức khỏe tận tâm 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. Đội ngũ chuyên gia */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Tận tâm phụng sự"
          title="Đội ngũ DSH Nature"
          description="Hội tụ đội ngũ giàu kinh nghiệm trong lĩnh vực y dược và chăm sóc sức khỏe."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              role: "Hội đồng Cố vấn Y dược",
              desc: "Các chuyên gia am hiểu thảo dược và sức khỏe cộng đồng.",
            },
            {
              role: "Đội ngũ Dược sĩ Tư vấn",
              desc: "Sẵn sàng hỗ trợ tư vấn thông tin sản phẩm và kiến thức sức khỏe.",
            },
            {
              role: "Bộ phận Chăm sóc Khách hàng",
              desc: "Đồng hành lắng nghe, giải đáp và phục vụ tận tâm từng đơn hàng.",
            },
          ].map((team, idx) => (
            <div key={idx} className="rounded-xl border border-border p-6 bg-white shadow-soft text-center space-y-3">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-light text-primary">
                <Users className="size-7" />
              </div>
              <h4 className="font-heading font-semibold text-foreground">{team.role}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{team.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
