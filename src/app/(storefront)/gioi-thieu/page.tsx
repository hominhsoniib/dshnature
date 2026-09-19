import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, CheckCircle2, FlaskConical, HeartHandshake, Leaf, ShieldCheck, Target, Users } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";

export const metadata: Metadata = {
  title: "Giới thiệu DSH NATURE | Đồng hành cùng sức khỏe gia đình",
  description:
    "Tìm hiểu về Công ty Cổ phần DSH Nature — sứ mệnh, tầm nhìn, 5 giá trị cốt lõi, sơ đồ chiến lược và tiêu chuẩn chất lượng sản phẩm chăm sóc sức khỏe gia đình.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 py-8 md:gap-16 md:py-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-primary-light/60 via-cream to-background px-4 py-12 text-center md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            CÔNG TY CỔ PHẦN DSH NATURE
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Đồng hành cùng sức khỏe gia đình
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base leading-relaxed">
            DSH Nature tự hào mang đến những giải pháp chăm sóc sức khỏe an toàn, tinh khiết từ thiên nhiên kết hợp nghiên cứu y dược hiện đại, đồng hành cùng sự an tâm của mỗi gia đình Việt Nam.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
            >
              Khám phá sản phẩm <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/tu-van"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-white px-6 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
            >
              Tư vấn cùng chuyên gia
            </Link>
          </div>
        </div>
      </section>

      {/* 01. Tổng quan DSH Nature */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Tổng quan doanh nghiệp</span>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Thương hiệu chăm sóc sức khỏe thiên nhiên uy tín
            </h2>
            <p className="leading-relaxed text-muted-foreground text-sm md:text-base">
              Công ty Cổ phần DSH Nature được xây dựng và phát triển với sứ mệnh cao cả: nâng cao chất lượng cuộc sống cho cộng đồng thông qua các sản phẩm có nguồn gốc thiên nhiên tinh sạch.
            </p>
            <p className="leading-relaxed text-muted-foreground text-sm md:text-base">
              Mỗi sản phẩm của DSH Nature đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt từ khâu chọn lọc nguyên liệu thảo dược đến dây chuyền sản xuất đạt chuẩn y tế GMP, đảm bảo tính an toàn và hiệu quả hỗ trợ cao nhất.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 bg-white shadow-soft">
                <p className="font-heading text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Thảo dược chọn lọc tự nhiên</p>
              </div>
              <div className="rounded-xl border border-border p-4 bg-white shadow-soft">
                <p className="font-heading text-2xl font-bold text-primary">GMP & ISO</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tiêu chuẩn sản xuất y tế</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <Image
              src="/gioi-thieu/kien-truc-web.png"
              alt="Tổng quan thương hiệu DSH Nature"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* 02. Sứ mệnh & Tầm nhìn (với hình ảnh thực tế) */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Định hướng chiến lược"
            title="Sứ mệnh & Tầm nhìn"
          />
          <div className="grid gap-8 md:grid-cols-2">
            {/* Khối Sứ mệnh */}
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft">
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-cream">
                  <Image
                    src="/gioi-thieu/su-menh.png"
                    alt="Sứ mệnh DSH Nature"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <HeartHandshake className="size-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Sứ mệnh DSH Nature</h3>
                </div>
                <p className="leading-relaxed text-xs md:text-sm text-muted-foreground">
                  Đồng hành cùng sức khỏe mọi gia đình Việt Nam bằng những giải pháp hỗ trợ chăm sóc sức khỏe an toàn, tinh khiết từ tự nhiên và đáng tin cậy. DSH Nature không ngừng lắng nghe và thấu hiểu nhu cầu của từng thành viên trong gia đình để mang tới sự chăm sóc chu đáo nhất.
                </p>
              </div>
            </div>

            {/* Khối Tầm nhìn */}
            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft">
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-cream">
                  <Image
                    src="/gioi-thieu/tam-nhin.png"
                    alt="Tầm nhìn DSH Nature"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Target className="size-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">Tầm nhìn DSH Nature</h3>
                </div>
                <p className="leading-relaxed text-xs md:text-sm text-muted-foreground">
                  Trở thành biểu tượng uy tín hàng đầu trong ngành thảo dược chăm sóc sức khỏe gia đình tại Việt Nam, mở rộng quy mô hệ thống phân phối đại lý rộng khắp 63 tỉnh thành và vươn tầm khu vực trong tương lai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Sơ đồ chiến lược phát triển */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          eyebrow="Định hướng phát triển"
          title="Sơ đồ chiến lược DSH Nature"
          description="Lộ trình phát triển bền vững và mở rộng hệ thống chăm sóc sức khỏe."
        />
        <div className="relative aspect-[21/9] min-h-[300px] w-full overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft">
          <Image
            src="/gioi-thieu/so-do-chien-luoc.png"
            alt="Sơ đồ chiến lược DSH Nature"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* 04. 5 Giá trị cốt lõi */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Trụ cột thương hiệu"
            title="5 Giá trị cốt lõi"
            description="Kim chỉ nam định hình mọi sản phẩm và hành động của DSH Nature."
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
        </div>
      </section>

      {/* 05. Tiêu chuẩn & Chứng nhận */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
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
      </section>

      {/* 06. Đội ngũ chuyên gia */}
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Tận tâm phụng sự"
            title="Đội ngũ DSH Nature"
            description="Hội tụ đội ngũ giàu kinh nghiệm trong lĩnh vực y dược và chăm sóc sức khỏe."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                role: "Hội đồng Cố vấn Y dược",
                desc: "Các chuyên gia am hiểu bài thuốc thảo dược và sức khỏe cộng đồng.",
              },
              {
                role: "Đội ngũ Dược sĩ Tư vấn",
                desc: "Sẵn sàng hỗ trợ tư vấn thông tin sản phẩm và kiến thức chăm sóc sức khỏe.",
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
        </div>
      </section>
    </div>
  );
}
