'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ChangePasswordPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data?.user) {
            setCurrentUser(data.user)
          } else {
            setMessage({ type: 'error', text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' })
          }
        }
      } catch (err) {
        console.error('Error fetching current user:', err)
      } finally {
        setLoadingUser(false)
      }
    }
    fetchMe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại (mật khẩu cũ).' })
      return
    }

    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và mật khẩu xác nhận không trùng khớp.' })
      return
    }

    if (!currentUser?.id || !currentUser?.email) {
      setMessage({ type: 'error', text: 'Không tìm thấy thông tin tài khoản đang đăng nhập.' })
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: Verify current password via login API
      const verifyRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: currentUser.email,
          password: currentPassword,
        }),
      })

      if (!verifyRes.ok) {
        setMessage({ type: 'error', text: 'Mật khẩu hiện tại (mật khẩu cũ) không chính xác. Vui lòng kiểm tra lại.' })
        setIsSubmitting(false)
        return
      }

      // Step 2: Update password to new password
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: newPassword,
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Vui lòng lưu lại mật khẩu mới của bạn.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const errorData = await res.json().catch(() => ({}))
        const errorMsg = errorData?.errors?.[0]?.message || 'Cập nhật mật khẩu thất bại. Vui lòng thử lại.'
        setMessage({ type: 'error', text: errorMsg })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi kết nối xảy ra. Vui lòng kiểm tra lại.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#64748b' }}>
        <Link href="/admin" style={{ color: '#087443', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
        <span>/</span>
        <span>Tài khoản</span>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Đổi mật khẩu</span>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#087443' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Đổi mật khẩu tài khoản Admin</h1>
            {currentUser && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Tài khoản: <strong style={{ color: '#087443' }}>{currentUser.email}</strong>
              </p>
            )}
          </div>
        </div>

        {message && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {loadingUser ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Đang tải thông tin tài khoản...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                1. Mật khẩu hiện tại (mật khẩu cũ) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu hiện tại của bạn"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                2. Mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                3. Xác nhận mật khẩu mới <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#087443',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(8, 116, 67, 0.25)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSubmitting ? 'Đang xác thực & Cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
              <Link
                href="/admin"
                style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Hủy bỏ
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
