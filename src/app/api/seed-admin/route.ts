import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@dshnature.vn',
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      const user = existingUsers.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: 'Admin@dshnature2026',
        },
      })
      return NextResponse.json({
        success: true,
        action: 'updated',
        email: 'admin@dshnature.vn',
        password: 'Admin@dshnature2026',
        message: 'Đã cập nhật mật khẩu mới cho admin@dshnature.vn',
      })
    } else {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@dshnature.vn',
          password: 'Admin@dshnature2026',
        },
      })
      return NextResponse.json({
        success: true,
        action: 'created',
        email: 'admin@dshnature.vn',
        password: 'Admin@dshnature2026',
        message: 'Đã khởi tạo tài khoản admin@dshnature.vn mới thành công',
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Có lỗi xảy ra khi tạo tài khoản Admin',
      },
      { status: 500 }
    )
  }
}
